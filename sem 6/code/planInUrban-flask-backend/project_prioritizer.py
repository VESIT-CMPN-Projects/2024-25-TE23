from reportlab.lib import colors
import requests
import pandas as pd
from datetime import datetime, timedelta
import numpy as np
from geopy.distance import geodesic
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()  # take environment variables from .env.

class ProjectPrioritizer:
    def __init__(self, projects_df):
        """
        Initialize with a DataFrame containing project information
        """
        self.projects = projects_df
        self.projects['proj_start_date'] = pd.to_datetime(self.projects['proj_start_date'])
        self.projects['proj_end_date'] = pd.to_datetime(self.projects['proj_end_date'])
        self.holiday_api_key = os.getenv('HOLIDAY_API_KEY')
        
        # Department priority weights (can be customized)
        self.dept_priority = {
            1: 10,  # Defense
            2: 9,   # Home Affairs
            3: 8,   # Health
            4: 7,   # Education
            5: 7,   # Infrastructure
            6: 6,   # Agriculture
            7: 5,   # Rural Development
            8: 4    # Others
        }
        
    def find_conflicting_projects(self):
        """
        Find projects with overlapping dates and locations
        """
        conflicts = []
        
        for i, proj1 in self.projects.iterrows():
            for j, proj2 in self.projects.iterrows():
                if i >= j:  # Skip duplicates and self-comparisons
                    continue
                    
                # Check date overlap
                date_overlap = max(0, (min(proj1['proj_end_date'], proj2['proj_end_date']) - 
                       max(proj1['proj_start_date'], proj2['proj_start_date'])).days)
                if date_overlap <= 0:
                    continue
                    
                # Check location proximity (within 10km)
                distance = geodesic(
                    (proj1['proj_latitude'], proj1['proj_longitude']),
                    (proj2['proj_latitude'], proj2['proj_longitude'])
                ).kilometers
                
                if distance <= 10:  # 10km threshold for location conflict
                    conflicts.append((proj1, proj2))
        
        return conflicts
                    
    def get_weather_conditions(self, latitude, longitude, start_date):
        """
        Get weather forecast for project location
        Using Open-Meteo or similar free weather API
        """
        try:
            # Check if the start_date is within the allowed range
            if start_date < datetime(2016, 1, 1) or start_date > datetime(2025, 4, 16):
                raise ValueError("Start date is out of the supported range (2016-01-01 to 2025-04-16).")
            
            url = f"https://api.open-meteo.com/v1/forecast"
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "daily": "weathercode,temperature_2m_max,precipitation_sum,windspeed_10m_max",
                "start_date": start_date.strftime("%Y-%m-%d"),
                "end_date": (start_date + timedelta(days=7)).strftime("%Y-%m-%d"),
                "timezone": "auto"
            }
            
            # Perform HTTPS request with SSL verification
            response = requests.get(url, params=params, verify=True)
            if response.status_code != 200:
                raise Exception(f"API Error: {response.status_code} {response.text}")
            data = response.json()
            
            # Calculate weather severity score
            weather_codes = data["daily"]["weathercode"]
            max_temps = data["daily"]["temperature_2m_max"]
            precipitation = data["daily"]["precipitation_sum"]
            wind_speed = data["daily"]["windspeed_10m_max"]
            
            # Higher score means worse weather conditions for construction
            weather_score = 0
            
            # WMO weather codes: higher values generally indicate worse weather
            weather_score += sum(code * 0.5 for code in weather_codes) / len(weather_codes)
            
            # Extreme temperatures (too hot or too cold)
            temp_score = sum(max(abs(temp - 25), 0) for temp in max_temps) / len(max_temps)
            weather_score += temp_score * 0.3
            
            # Heavy precipitation
            precip_score = sum(precipitation) * 2
            weather_score += precip_score
            
            # Strong winds
            wind_score = sum(speed for speed in wind_speed if speed > 20) * 0.5
            weather_score += wind_score
            
            return weather_score
        except ValueError as e:
            print(f"Date Range Error: {e}")
            return 50  # Default moderate score if date is out of range
        except Exception as e:
            print(f"Weather API error: {e}")
            return 50  # Default moderate score if API fails
    
    def get_festivals(self, location, start_date, end_date):
        """
        Get festivals/holidays during project timeline
        Using Calendarific or similar holiday API
        """
        try:
            # For India-specific festivals, we'll use a combination of national and regional holidays
            state_mapping = {
                "Delhi": "DL",
                "Mumbai": "MH",
                "Kolkata": "WB",
                # Add more mappings as needed
            }
            
            # Extract state from location (simplified)
            state = None
            for key in state_mapping:
                if key.lower() in location.lower():
                    state = state_mapping[key]
                    break
            
            if not state:
                state = "national"  # Default to national holidays
                
            # Call to holiday API
            url = f"https://calendarific.com/api/v2/holidays"
            params = {
                "api_key": self.holiday_api_key,
                "country": "IN",
                "year": start_date.year,
                "type": "national,local",
                "location": state
            }
            
            response = requests.get(url, params=params)
            print(response.text)
            holidays = response.json().get("response", {}).get("holidays", [])
            
            # Filter holidays within project timeline
            relevant_holidays = []
            for holiday in holidays:
                holiday_date = datetime.strptime(holiday["date"]["iso"], "%Y-%m-%d").date()
                if start_date.date() <= holiday_date <= end_date.date():
                    relevant_holidays.append(holiday)
            
            # Calculate festival impact score based on importance
            festival_score = 0
            for holiday in relevant_holidays:
                if holiday["primary_type"] == "National holiday":
                    festival_score += 10
                elif "religious" in holiday["type"]:
                    festival_score += 7
                else:
                    festival_score += 3
                    
            return festival_score, len(relevant_holidays)
        except Exception as e:
            print(f"Holiday API error: {e}")
            return 0, 0  # Return zero if API fails

    def calculate_priority_score(self, project):
        """
        Calculate a priority score for a project
        Higher score means higher priority
        """
        score = 0
        
        # Base priority based on department
        score += self.dept_priority.get(project['dept_id'], 3)
        
        # Approved projects get priority
        if project['isApproved']:
            score += 5
        
        # Project budget size (normalized to 0-10 scale)
        # Assumption: Larger projects are higher priority
        budget_score = min(project['proj_estimated_budget'] / 1000000, 10)
        score += budget_score
        
        # Factor in weather conditions (negative impact)
        weather_score = self.get_weather_conditions(
            project['proj_latitude'], 
            project['proj_longitude'],
            project['proj_start_date']
        )
        
        # Weather reduces priority (worse weather = lower score)
        score -= min(weather_score / 10, 5)
        
        # Factor in festivals (negative impact)
        festival_score, festival_count = self.get_festivals(
            project['proj_location'],
            project['proj_start_date'],
            project['proj_end_date']
        )
        
        # Festivals reduce priority
        score -= min(festival_score / 5, 8)
        
        return max(score, 0)  # Ensure non-negative score
    
    def prioritize_conflicting_projects(self):
        """
        Compare conflicting projects and recommend priority
        """
        conflicts = self.find_conflicting_projects()
        recommendations = []
        
        for proj1, proj2 in conflicts:
            score1 = self.calculate_priority_score(proj1)
            score2 = self.calculate_priority_score(proj2)
            
            if score1 >= score2:
                priority_project = proj1
                secondary_project = proj2
                score_diff = score1 - score2
            else:
                priority_project = proj2
                secondary_project = proj1
                score_diff = score2 - score1
            
            recommendations.append({
                "priority_project": priority_project,
                "secondary_project": secondary_project,
                "priority_score": round(max(score1, score2), 2),
                "secondary_score": round(min(score1, score2), 2),
                "score_difference": round(score_diff, 2),
                "confidence": min(score_diff / 5 * 100, 100)  # Convert score diff to confidence %
            })
        
        return recommendations
    
    # def generate_recommendation_report(self):
    #     """
    #     Generate a detailed report with recommendations
    #     """
    #     recommendations = self.prioritize_conflicting_projects()
        
    #     if not recommendations:
    #         return "No conflicting projects found."
        
    #     report = "# Project Priority Recommendations\n\n"
    #     report += f"Analysis date: {datetime.now().strftime('%Y-%m-%d')}\n"
    #     report += f"Total conflicts found: {len(recommendations)}\n\n"
        
    #     for i, rec in enumerate(recommendations, 1):
    #         report += f"## Conflict #{i}\n\n"
    #         report += f"### Priority Project (Score: {rec['priority_score']})\n"
    #         report += f"- ID: {rec['priority_project']['proj_id']}\n"
    #         report += f"- Title: {rec['priority_project']['proj_title']}\n"
    #         report += f"- Location: {rec['priority_project']['proj_location']}\n"
    #         report += f"- Timeline: {rec['priority_project']['proj_start_date']} to {rec['priority_project']['proj_end_date']}\n"
    #         report += f"- Budget: ₹{rec['priority_project']['proj_estimated_budget']:,.2f}\n\n"
            
    #         report += f"### Secondary Project (Score: {rec['secondary_score']})\n"
    #         report += f"- ID: {rec['secondary_project']['proj_id']}\n"
    #         report += f"- Title: {rec['secondary_project']['proj_title']}\n"
    #         report += f"- Location: {rec['secondary_project']['proj_location']}\n"
    #         report += f"- Timeline: {rec['secondary_project']['proj_start_date']} to {rec['secondary_project']['proj_end_date']}\n"
    #         report += f"- Budget: ₹{rec['secondary_project']['proj_estimated_budget']:,.2f}\n\n"
            
    #         report += f"### Recommendation\n"
    #         report += f"- Score difference: {rec['score_difference']}\n"
    #         report += f"- Confidence: {rec['confidence']:.1f}%\n"
            
    #         if rec['confidence'] > 70:
    #             recommendation = "Strongly recommend prioritizing the primary project."
    #         elif rec['confidence'] > 40:
    #             recommendation = "Recommend prioritizing the primary project, but consider coordination."
    #         else:
    #             recommendation = "Projects have similar priority. Consider running in parallel with coordination."
                
    #         report += f"- Recommendation: {recommendation}\n\n"
    #         report += "---\n\n"
        
    #     return report
    def generate_recommendation_report(self):
        """
        Generate a detailed report with recommendations
        """
        recommendations = self.prioritize_conflicting_projects()
        
        if not recommendations:
            return "No conflicting projects found."
        
        report = "# Project Priority Recommendations\n\n"
        report += f"Analysis date: {datetime.now().strftime('%Y-%m-%d')}\n"
        report += f"Total conflicts found: {len(recommendations)}\n\n"
        
        for i, rec in enumerate(recommendations, 1):
            report += f"## Conflict #{i}\n\n"
            report += f"### Priority Project (Score: {rec['priority_score']})\n"
            report += f"- ID: {rec['priority_project']['proj_id']}\n"
            report += f"- Title: {rec['priority_project']['proj_title']}\n"
            report += f"- Location: {rec['priority_project']['proj_location']}\n"
            report += f"- Timeline: {rec['priority_project']['proj_start_date']} to {rec['priority_project']['proj_end_date']}\n"
            report += f"- Budget: ₹{rec['priority_project']['proj_estimated_budget']:,.2f}\n\n"
            
            report += f"### Secondary Project (Score: {rec['secondary_score']})\n"
            report += f"- ID: {rec['secondary_project']['proj_id']}\n"
            report += f"- Title: {rec['secondary_project']['proj_title']}\n"
            report += f"- Location: {rec['secondary_project']['proj_location']}\n"
            report += f"- Timeline: {rec['secondary_project']['proj_start_date']} to {rec['secondary_project']['proj_end_date']}\n"
            report += f"- Budget: ₹{rec['secondary_project']['proj_estimated_budget']:,.2f}\n\n"
            
            report += f"### Recommendation\n"
            report += f"- Score difference: {rec['score_difference']}\n"
            report += f"- Confidence: {rec['confidence']:.1f}%\n"
            
            if rec['confidence'] > 70:
                recommendation = "Strongly recommend prioritizing the primary project."
            elif rec['confidence'] > 40:
                recommendation = "Recommend prioritizing the primary project, but consider coordination."
            else:
                recommendation = "Projects have similar priority. Consider running in parallel with coordination."
                
            report += f"- Recommendation: {recommendation}\n\n"
            report += "---\n\n"
        
        # Save to file
        with open('recommendation_report.txt', 'w', encoding='utf-8') as file:
            file.write(report)
        
        print("Recommendation report saved to 'recommendation_report.txt'")

    def generate_pdf_report(self, filename="project_recommendations.pdf"):
        """
        Generate a detailed PDF report with project recommendations
        """
        recommendations = self.prioritize_conflicting_projects()
        
        if not recommendations:
            return "No conflicting projects found."

        c = canvas.Canvas(filename, pagesize=letter)
        width, height = letter
        c.setFont("Helvetica-Bold", 14)
        c.drawString(30, height - 40, "Project Recommendation Report")

        c.setFont("Helvetica", 10)
        c.drawString(30, height - 60, f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        c.drawString(30, height - 75, f"Total conflicts found: {len(recommendations)}")
        
        y = height - 100
        
        for i, rec in enumerate(recommendations, 1):
            if y < 120:
                c.showPage()
                c.setFont("Helvetica", 10)
                y = height - 60

            c.setFont("Helvetica-Bold", 12)
            c.setFillColor(colors.darkblue)
            c.drawString(30, y, f"Conflict #{i}")
            y -= 15

            c.setFont("Helvetica-Bold", 10)
            c.setFillColor(colors.black)
            c.drawString(30, y, f"Priority Project (Score: {rec['priority_score']})")
            y -= 12
            c.setFont("Helvetica", 10)
            pp = rec['priority_project']
            c.drawString(40, y, f"ID: {pp['proj_id']} | Title: {pp['proj_title']}")
            y -= 12
            c.drawString(40, y, f"Location: {pp['proj_location']}")
            y -= 12
            c.drawString(40, y, f"Timeline: {pp['proj_start_date']} to {pp['proj_end_date']}")
            y -= 12
            c.drawString(40, y, f"Budget: ₹{pp['proj_estimated_budget']:,.2f}")
            y -= 15

            c.setFont("Helvetica-Bold", 10)
            c.drawString(30, y, f"Secondary Project (Score: {rec['secondary_score']})")
            y -= 12
            c.setFont("Helvetica", 10)
            sp = rec['secondary_project']
            c.drawString(40, y, f"ID: {sp['proj_id']} | Title: {sp['proj_title']}")
            y -= 12
            c.drawString(40, y, f"Location: {sp['proj_location']}")
            y -= 12
            c.drawString(40, y, f"Timeline: {sp['proj_start_date']} to {sp['proj_end_date']}")
            y -= 12
            c.drawString(40, y, f"Budget: ₹{sp['proj_estimated_budget']:,.2f}")
            y -= 15

            c.setFont("Helvetica-Bold", 10)
            c.drawString(30, y, "Recommendation:")
            y -= 12
            c.setFont("Helvetica", 10)
            c.drawString(40, y, f"Score difference: {rec['score_difference']}")
            y -= 12
            c.drawString(40, y, f"Confidence: {rec['confidence']:.1f}%")
            y -= 12

            if rec['confidence'] > 70:
                recommendation = "Strongly recommend prioritizing the primary project."
            elif rec['confidence'] > 40:
                recommendation = "Recommend prioritizing the primary project, but consider coordination."
            else:
                recommendation = "Projects have similar priority. Consider running in parallel with coordination."

            c.drawString(40, y, f"Recommendation: {recommendation}")
            y -= 20

            c.setStrokeColor(colors.grey)
            c.line(30, y, width - 30, y)
            y -= 20

        c.save()
        return f"Report saved as {filename}"

# Example usage
# sample_data = pd.read_csv('projects.csv')
# prioritizer = ProjectPrioritizer(sample_data)
# prioritizer.generate_recommendation_report()
# prioritizer.generate_pdf_report()
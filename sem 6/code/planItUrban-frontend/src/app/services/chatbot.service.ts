// MODULES //
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

// UTILS //
import { environment } from 'src/environments/environment';

// OTHERS //
import { map, Observable, switchMap, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${environment.apiKey}`;
  private validateDeptCodeUrl = 'http://localhost:8080/chatbot/verify-code';
  private getProjectStatusUrl = 'http://localhost:8080/chatbot/get-project-status';
  private countProjectsUrl = 'http://localhost:8080/chatbot/count-projects';
  private getPendingProjectsUrl = 'http://localhost:8080/chatbot/get-pending-projects';
  private getOngoingProjectsUrl = 'http://localhost:8080/chatbot/get-ongoing-projects';
  private getHighBudgetProjectsUrl = 'http://localhost:8080/chatbot/get-high-budget-projects';
  private countPendingProjectsUrl = 'http://localhost:8080/chatbot/count-pending-projects';
  private countOngoingProjectsUrl = 'http://localhost:8080/chatbot/count-ongoing-projects';
  private countHighBudgetProjectsUrl = 'http://localhost:8080/chatbot/count-high-budget-projects';
  
  constructor(private http: HttpClient) {}

  getResponse(userMessage: string, departmentName?: string): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const safeDepartmentName = departmentName ?? 'Unknown Department';
    
    console.log('User Department:', safeDepartmentName);

   const departmentContext = 
    `You are an AI assistant for the ${safeDepartmentName} department.
    If the user asks about projects, respond with EXACTLY this text: 'FETCH_PROJECTS'. DO NOT add any extra words.
    If the user asks about in general project count without pending, ongoing respond with EXACTLY this text: 'COUNT_PROJECTS'.
    If the user asks about pending projects, respond with EXACTLY this text: 'PENDING_PROJECTS'.
    If the user asks about ongoing projects, respond with EXACTLY this text: 'ONGOING_PROJECTS'.
    If the user asks about high-budget projects, respond with EXACTLY this text: 'HIGH_BUDGET_PROJECTS'.
    If the user asks about the count of pending projects, respond with EXACTLY this text: 'PENDING_PROJECTS_COUNT'.
    If the user asks about the count of ongoing projects, respond with EXACTLY this text: 'ONGOING_PROJECTS_COUNT'.
    If the user asks about the count of high-budget projects, respond with EXACTLY this text: 'HIGH_BUDGET_PROJECTS_COUNT'.
    If the user's question is related to the ${safeDepartmentName}, answer based on the department's work and responsibilities only in detailed form.`;


    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${departmentContext}\n\nUser: ${userMessage}` }],
        },
      ],
      generationConfig: { temperature: 0.7, topP: 0.9 },
    };

    return this.http.post<{ candidates: any[] }>(this.apiUrl, body, { headers }).pipe(
      switchMap((response) => {
        console.log('API Raw Response:', response);

        if (!response || !response.candidates || response.candidates.length === 0) {
          return of('No response available');
        }

        const aiResponse = response.candidates[0]?.content?.parts?.[0]?.text?.trim() || 'No valid response received.';
        console.log('Extracted AI Response:', aiResponse);

      
        if (aiResponse.includes('FETCH_PROJECTS')) {
          return this.fetchProjectsFromBackend(safeDepartmentName);
        } else if (aiResponse.includes('PENDING_PROJECTS_COUNT')) {
          console.log("Triggering pending project count API");
          return this.getPendingProjectCount(safeDepartmentName);
        }else if (aiResponse.includes('ONGOING_PROJECTS_COUNT')) {
          return this.getOngoingProjectCount(safeDepartmentName);
        } else if (aiResponse.includes('HIGH_BUDGET_PROJECTS_COUNT')) {
          return this.getHighBudgetProjectCount(safeDepartmentName);
        }else if (aiResponse.includes('COUNT_PROJECTS')) {
          console.log("Triggering  project count API");
          return this.getProjectCount(safeDepartmentName);
        } else if (aiResponse.includes('PENDING_PROJECTS')) {
          return this.getPendingProjects(safeDepartmentName);
        } else if (aiResponse.includes('ONGOING_PROJECTS')) {
          return this.getOngoingProjects(safeDepartmentName);
        } else if (aiResponse.includes('HIGH_BUDGET_PROJECTS')) {
          return this.getHighBudgetProjects(safeDepartmentName);
        } 

        return of(aiResponse); 
      })
    );
  }

  fetchProjectsFromBackend(departmentName: string): Observable<string> {
    return this.http.post<{ valid: boolean; projects?: any[] }>(this.getProjectStatusUrl, { department: departmentName }).pipe(
      map((response) => {
        console.log('Project API Response:', response);
        if (!response.valid || !response.projects || response.projects.length === 0) {
          return `There are no projects in the ${departmentName} department.`;
        }
        return this.formatProjects(response.projects, departmentName);
      })
    );
  }

getProjectCount(departmentId: string): Observable<string> {
  return this.http.get<{ valid: boolean; departmentId: string; projectCount: number }>(
    `${this.countProjectsUrl}/${departmentId}`
  ).pipe(
    map((response) => {
      if (!response.valid) {
        return `Could not fetch project count for department ID: ${departmentId}`;
      }
      return `You have total ${response.projectCount} projects.`;
    })
  );
}

 getPendingProjectCount(departmentId: string): Observable<string> {
    return this.http.get<{ valid: boolean; pendingProjectCount: number, departmentId: string; }>(`${this.countPendingProjectsUrl}/${departmentId}`)
   .pipe(
      map((response) => {
        if (!response.valid) {
          return `Could not fetch pending project count for department ID: ${departmentId}`;
        }
        return `The ${departmentId} department has ${response.pendingProjectCount} pending projects.`;
      })
    );
}

  getOngoingProjectCount(departmentId: string): Observable<string> {
    return this.http.get<{ valid: boolean; ongoingProjectCount: number }>(`${this.countOngoingProjectsUrl}/${departmentId}`).pipe(
      map((response) => response.valid ? `Ongoing projects count: ${response.ongoingProjectCount}.` : `Could not fetch ongoing project count.`)
    );
  }

  getHighBudgetProjectCount(departmentId: string): Observable<string> {
    return this.http.get<{ valid: boolean; highBudgetProjectCount: number }>(`${this.countHighBudgetProjectsUrl}/${departmentId}`).pipe(
      map((response) => response.valid ? `High-budget projects count: ${response.highBudgetProjectCount}.` : `Could not fetch high-budget project count.`)
    );
  }


getPendingProjects(departmentId: string): Observable<string> {
  return this.http.get<{ valid: boolean; departmentId: string; pendingProjects?: any[] }>(
    `${this.getPendingProjectsUrl}/${departmentId}`
  ).pipe(
    map((response) => {
      console.log('Pending Projects API Response:', response); 

      if (!response.valid || !response.pendingProjects|| response.pendingProjects.length === 0) {
        return `No pending projects for department: ${departmentId}`;
      }

      return this.formatProjects(response.pendingProjects, `Department ID: ${departmentId}`);
    })
  );
}




getOngoingProjects(departmentId: string): Observable<string> {
  return this.http.get<{ valid: boolean; departmentId: string; ongoingProjects?: any[] }>(
    `${this.getOngoingProjectsUrl}/${departmentId}`
  ).pipe(
    map((response) => {
      if (!response.valid || !response.ongoingProjects || response.ongoingProjects.length === 0) {
        return `No ongoing projects for department: ${departmentId}`;
      }
      return this.formatProjects(response.ongoingProjects, `Department ID: ${departmentId}`);
    })
  );
}

getHighBudgetProjects(departmentId: string): Observable<string> {
  return this.http.get<{ valid: boolean; departmentId: string; highBudgetProjects?: any[] }>(
    `${this.getHighBudgetProjectsUrl}/${departmentId}`
  ).pipe(
    map((response) => {
      if (!response.valid || !response.highBudgetProjects || response.highBudgetProjects.length === 0) {
        return `No high-budget projects for department: ${departmentId}`;
      }
      return this.formatProjects(response.highBudgetProjects, `Department ID: ${departmentId}`);
    })
  );
}


  private formatProjects(projects: any[], departmentName: string): string {
    let projectList = `Here are the projects for ${departmentName}:<br><br>`;
    projects.forEach((project) => {
      projectList += `🔹 <strong>${project.proj_title}</strong> <br>`;
      projectList += `📍 Location: ${project.proj_location} <br>`;
      projectList += `📝 Description: ${project.proj_desc} <br>`;
      projectList += `📅 Start: ${new Date(project.proj_start_date).toDateString()} <br>`;
      projectList += `🏁 End: ${new Date(project.proj_end_date).toDateString()} <br>`;
      projectList += `💰 Budget: ₹${project.proj_estimated_budget.toLocaleString()} <br>`;
      projectList += `📌 Status: <strong>${project.proj_status}</strong> <br><br>`;
    });
    return projectList;
  }

  validateDepartmentCode(deptCode: string): Observable<{ valid: boolean; departmentName?: string; message?: string }> {
    return this.http.post<{ valid: boolean; departmentName?: string; message?: string }>(
      this.validateDeptCodeUrl,
      { deptCode }
    );
  }



}

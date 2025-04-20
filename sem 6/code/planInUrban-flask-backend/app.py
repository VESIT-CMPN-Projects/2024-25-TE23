from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import os
from project_prioritizer import ProjectPrioritizer  # Your custom class

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Project Prioritizer API"}), 200

@app.route('/process-projects', methods=['POST'])
def process_projects():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    try:
        # Read the CSV file into a DataFrame
        sample_data = pd.read_csv(file_path)
        print("CSV file read successfully")

        # Process the projects using your prioritizer
        prioritizer = ProjectPrioritizer(sample_data)
        recommendations = prioritizer.generate_recommendation_report()
        # Generate the PDF report – this will create (or overwrite) 'recommendation_report.pdf'
        pdf_status = prioritizer.generate_pdf_report()

        # Create the absolute download URL (adjust host/port as needed)
        download_url = "http://localhost:5000/download-report"

        response = {
            "message": "Recommendation and PDF report generated successfully.",
            "recommendations": recommendations,
            "download_url": download_url
        }
        return jsonify(response), 200
    except Exception as e:
        print("Error processing projects:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/download-report', methods=['GET'])
def download_report():
    # Get the absolute path of the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Full absolute path to the PDF
    pdf_file_path = os.path.join(current_dir, 'project_recommendations.pdf')
    
    print("Looking for file at:", pdf_file_path)

    if os.path.exists(pdf_file_path):
        return send_file(pdf_file_path, as_attachment=True)
    
    return jsonify({"error": "PDF report not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
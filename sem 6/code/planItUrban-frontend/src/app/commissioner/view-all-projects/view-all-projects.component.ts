// MODULES //
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// SERVICES //
import { ExcelService } from 'src/app/services/excel.service';
import { PdfService } from 'src/app/services/pdf.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-view-all-projects',
  templateUrl: './view-all-projects.component.html',
  styleUrls: ['./view-all-projects.component.scss'],
})
export class ViewAllProjectsComponent implements OnInit {
  projects!: any;
  recommendations: any;
  constructor(
    private excelService: ExcelService,
    private pdfService: PdfService,
    private projService: ProjectService,
    private http: HttpClient // Inject HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchAllProjects();
  }

  // Function to approve project
  approveProject(proj_id: string): void {
    const project = this.projects.find((p: any) => p.proj_id === proj_id);
    if (project) {
      project.proj_status = 'Approved';
      alert('Project ' + proj_id + ' has been approved!');
    }
  }

  // Function to reject project
  rejectProject(proj_id: string): void {
    const project = this.projects.find((p: any) => p.proj_id === proj_id);
    if (project) {
      project.proj_status = 'Rejected';
      alert('Project ' + proj_id + ' has been rejected!');
    }
  }

  downloadExcel(): void {
    this.excelService.exportAsExcelFile(this.projects, 'projects');
  }

  downloadPdf(): void {
    this.pdfService.exportAsPdf(this.projects, 'projects');
  }

  fetchAllProjects() {
    this.projService.fetchApprovedProjects().subscribe((value) => {
      console.log(value);
      this.projects = value;
    });
  }
  // Helper function to convert the projects array into CSV format
  convertToCSV(projects: any[]): string {
    const header = [
      'proj_id',
      'proj_title',
      'proj_desc',
      'proj_location',
      'proj_latitude',
      'proj_longitude',
      'proj_start_date',
      'proj_end_date',
      'proj_estimated_budget',
      'proj_status',
      'dept_id',
      'isApproved',
    ];

    // Create rows based on the project data
    const rows = projects.map((project: any) => [
      project.proj_id,
      `"${project.proj_title}"`,
      `"${project.proj_desc}"`,
      `"${project.proj_location}"`,
      project.proj_latitude,
      project.proj_longitude,
      project.proj_start_date,
      project.proj_end_date,
      project.proj_estimated_budget,
      `"${project.proj_status}"`,
      project.dept_id,
      project.isApproved,
    ]);

    // Join header and rows, and then join each row with commas
    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');

    return csv;
  }

  // // Updated function to send CSV file
  // getRecommendation(): void {
  //   // Convert the projects data to CSV
  //   const csvData = this.convertToCSV(this.projects);

  //   // Create a Blob from the CSV data
  //   const blob = new Blob([csvData], { type: 'text/csv' });

  //   // Create a FormData object to send the file
  //   const formData = new FormData();
  //   formData.append('file', blob, 'projects.csv'); // Attach CSV data as a file

  //   // Complete URL of your backend
  //   const apiUrl = 'http://localhost:5000/process-projects'; // Replace with your actual backend URL

  //   // Send the request
  //   this.http.post(apiUrl, formData).subscribe(
  //     (response: any) => {
  //       console.log(response);
  //       alert('Prioritization recommendations received successfully!');

  //         // Provide a link to download the report
  //         const downloadLink = response.download_url;
  //         window.location.href = downloadLink; // Automatically triggers the download
  //     },
  //     (error) => {
  //       console.error('Error fetching recommendations:', error);
  //       alert('Error fetching prioritization recommendations.');
  //     }
  //   );
  // }
  getRecommendation(): void {
    // Convert the project data to CSV format
    const csvData = this.convertToCSV(this.projects);

    // Create a Blob from the CSV data
    const blob = new Blob([csvData], { type: 'text/csv' });

    // Create a FormData object and append the CSV blob
    const formData = new FormData();
    formData.append('file', blob, 'projects.csv');

    // Full URL of your backend endpoint
    const apiUrl = 'http://localhost:5000/process-projects';

    // POST the FormData to the backend
    this.http.post(apiUrl, formData).subscribe(
      (response: any) => {
        console.log(response);
        alert('Prioritization recommendations received successfully!');

        // Trigger the download of the PDF by navigating to the download URL
        const downloadLink = response.download_url;
        
        // Create an invisible anchor to trigger download
      const a = document.createElement('a');
      a.href = downloadLink;
      a.download = 'project_recommendations.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    (error) => {
      console.error('Error fetching recommendations:', error);
      alert('Error fetching prioritization recommendations.');
    }
  );
}
}
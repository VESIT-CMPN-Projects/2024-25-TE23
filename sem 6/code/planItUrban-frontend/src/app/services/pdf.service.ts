import { Injectable } from '@angular/core';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Ensure you import the autoTable plugin

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}

  exportAsPdf(json: any[], fileName: string): void {
    const doc = new jsPDF();
    (doc as any).autoTable({
      head: [
        [
          'Project ID',
          'Project Title',
          'Location',
          'Description',
          'Latitude',
          'Longitude',
          'Start Date',
          'End Date',
          'Budget',
          'Status',
        ],
      ],
      body: json.map((project) => [
        project.proj_id,
        project.proj_title,
        project.proj_location,
        project.proj_desc,
        project.proj_latitude,
        project.proj_longitude,
        project.proj_start_date,
        project.proj_end_date,
        project.proj_estimated_budget,
        project.proj_status,
      ]),
    });
    doc.save(`${fileName}.pdf`);
  }
}

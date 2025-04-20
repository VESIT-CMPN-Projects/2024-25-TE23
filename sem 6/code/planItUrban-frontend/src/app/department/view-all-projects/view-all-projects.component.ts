// MODULES //
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

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
  projects!:any
  dept_id!:number
  constructor(
    private excelService: ExcelService,
    private pdfService: PdfService,private projService:ProjectService,private cookieService:CookieService
  ) {}

  ngOnInit(): void {
    this.dept_id=Number(this.cookieService.get('user_id')) ?? 0
    console.log(this.dept_id)
    if(this.dept_id!==0){
      this.fetchProjects(this.dept_id)
    }
  }

  downloadExcel(): void {
    this.excelService.exportAsExcelFile(this.projects, 'projects');
  }

  downloadPdf(): void {
    this.pdfService.exportAsPdf(this.projects, 'projects');
  }

  fetchProjects(dept_id:number){
    this.projService.fetchProjects(dept_id).subscribe((value)=>{
      this.projects=value
      console.log("projects fetched from db")
    })
  }


   updateProjectStatus(project: any) {
    const updatedStatus = project.new_status;

    this.projService.updateProjectStatus(project.proj_id, updatedStatus).subscribe(
      (response) => {
        console.log('Status updated successfully', response);
        project.proj_status = updatedStatus; 
       
      },
      (error) => {
        console.error('Error updating status:', error);
      
      }
    );
  }
}









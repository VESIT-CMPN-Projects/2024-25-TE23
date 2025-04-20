// // MODULES //
// import { Component } from '@angular/core';

// // SERVICES //
// import { ExcelService } from 'src/app/services/excel.service';
// import { PdfService } from 'src/app/services/pdf.service';
// import { ProjectService } from 'src/app/services/project.service';

// @Component({
//   selector: 'app-view-projects',
//   templateUrl: './view-projects.component.html',
//   styleUrls: ['./view-projects.component.scss'],
// })
// export class ViewProjectsComponent {

//   projects!:any
//   constructor(
//     private excelService: ExcelService,
//     private pdfService: PdfService,private projService:ProjectService
//   ) {}

//   ngOnInit(): void {
//     this.fetchProjects()
//   }

//   downloadExcel(): void {
//     this.excelService.exportAsExcelFile(this.projects, 'projects');
//   }

//   downloadPdf(): void {
//     this.pdfService.exportAsPdf(this.projects, 'projects');
//   }


//   fetchProjects(){
//     this.projService.fetchProjectsOfOfficer().subscribe((value)=>{
//       console.log(value)
//       this.projects=value

//     })
//   }



// }











// MODULES //
import { Component, OnInit } from '@angular/core';

// SERVICES //
import { ExcelService } from 'src/app/services/excel.service';
import { PdfService } from 'src/app/services/pdf.service';
import { ProjectService } from 'src/app/services/project.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.scss'],
})
export class ViewProjectsComponent implements OnInit {

  projects!: any;
  officerId!:any;

  constructor(
    private excelService: ExcelService,
    private pdfService: PdfService,
    private projService: ProjectService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.officerId = this.cookieService.get('user_id') || 0;
    console.log("officerId", this.officerId)

    if (this.officerId) {
      this.fetchProjects();
    } else {
      console.error('Invalid officer ID');
    }
  }

  downloadExcel(): void {
    this.excelService.exportAsExcelFile(this.projects, 'projects');
  }

  downloadPdf(): void {
    this.pdfService.exportAsPdf(this.projects, 'projects');
  }

  fetchProjects() {
    this.projService.fetchProjectsOfOfficer(this.officerId).subscribe({
      next: (value) => {
        console.log(value);
        this.projects = value;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
      }
    });
  }
}

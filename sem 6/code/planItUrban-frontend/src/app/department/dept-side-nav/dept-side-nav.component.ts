import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-dept-side-nav',
  templateUrl: './dept-side-nav.component.html',
  styleUrls: ['./dept-side-nav.component.scss']
})
export class DeptSideNavComponent implements OnInit {
  departmentName: string = 'Loading...';

  constructor(
    private cookieService: CookieService,
    private deptService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.getDepartmentName();
  }

  getDepartmentName(): void {
    const deptId = this.cookieService.get('user_id'); 
    console.log('Department ID from Cookie:', deptId); 

    if (deptId) {
      this.deptService.getDepartmentById(deptId).subscribe(
        (response: any) => {
          console.log('API Response:', response); 

          if (response && response.dept_name) {
            this.departmentName = response.dept_name;
          } else {
            this.departmentName = 'Unknown Department';
          }
        },
        (error) => {
          console.error('Error fetching department name:', error);
          this.departmentName = 'Unknown Department';
        }
      );
    } else {
      console.warn('No department ID found in cookies'); 
      this.departmentName = 'Unknown Department';
    }
  }
}

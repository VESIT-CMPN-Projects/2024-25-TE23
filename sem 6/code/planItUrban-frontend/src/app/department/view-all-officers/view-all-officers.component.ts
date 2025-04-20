import { Component, OnInit } from '@angular/core';
import { OfficerService } from 'src/app/services/officer.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-view-all-officers',
  templateUrl: './view-all-officers.component.html',
  styleUrls: ['./view-all-officers.component.scss']
})
export class ViewAllOfficersComponent implements OnInit {

  officers: any[] = [];
  deptId!: number;

  constructor(
    private officerService: OfficerService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    // Get department ID from cookie
    this.deptId = Number(this.cookieService.get('user_id')) || 0;

    if (this.deptId) {
      this.fetchOfficers();
    }
  }

  fetchOfficers(): void {
    this.officerService.getOfficersByDept(this.deptId).subscribe(
      (data) => {
        console.log(data);
        this.officers = data;
      },
      (error) => console.error('Error fetching officers:', error)
    );
  }

  getProgressClass(progress: number): string {
  if (progress >= 70) {
    return 'high';
  } else if (progress >= 30) {
    return 'medium';
  } else {
    return 'low';
  }
}

}

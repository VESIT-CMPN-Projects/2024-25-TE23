// MODULES //
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { OfficerService } from 'src/app/services/officer.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  // officers = [
  //   {
  //     name: 'John Doe',
  //     email: 'johndoe@example.com',
  //   },
  //   {
  //     name: 'Jane Smith',
  //     email: 'janesmith@example.com',
  //   },
  //   {
  //     name: 'Mark Johnson',
  //     email: 'markjohnson@example.com',
  //   },
  // ];
  officers!:any
  projectsRequests!:any

  // overlappingProjects = [
  //   {
  //     proj_id: 1,
  //     proj_title: 'Urban Development Project A',
  //     proj_location: 'Downtown Area',
  //     proj_desc: 'Developing key infrastructure in the downtown area.',
  //     proj_latitude: 40.7128,
  //     proj_longitude: -74.006,
  //     proj_start_date: new Date('2025-02-01'),
  //     proj_end_date: new Date('2025-08-01'),
  //     proj_estimated_budget: 5000000,
  //     proj_status: 'Ongoing',
  //     showDetails: false,
  //   },
  //   {
  //     proj_id: 2,
  //     proj_title: 'Smart City Initiative',
  //     proj_location: 'Tech Park',
  //     proj_desc:
  //       'Implementing smart systems for traffic management and public safety.',
  //     proj_latitude: 40.73061,
  //     proj_longitude: -73.935242,
  //     proj_start_date: new Date('2025-03-01'),
  //     proj_end_date: new Date('2025-09-01'),
  //     proj_estimated_budget: 10000000,
  //     proj_status: 'Planning',
  //     showDetails: false,
  //   },
  // ];

  constructor(private cookieService:CookieService,private officerService:OfficerService,private projService:ProjectService) {}

  ngOnInit(): void {
    const dept_id = Number(this.cookieService.get("user_id")) ?? -1
    this.officerService.fetchOfficersByDept(dept_id).subscribe((value)=>{
      console.log(value)
      this.officers=value
    })

    this.fetchProjectRequests()
    this.fetchOverlappingProjects()
  }

  // Function to toggle visibility of project details
  showProjectDetails(project: any): void {
    project.showDetails = !project.showDetails;
  }


  fetchProjectRequests(){
    this.projService.fetchProjectRequests().subscribe((value)=>{
      this.projectsRequests=value
      console.log(this.projectsRequests)
    })
  }

  // In your component
overlappingProjects:any = [];


fetchOverlappingProjects() {
  this.overlappingProjects = []; // Ensure it starts as an empty array
  this.projService.fetchProjectRequests().subscribe(
    (data: any) => {
      console.log('Raw overlapping projects data:', data); // Debugging log

      if (!data || data.length === 0) {
        console.warn('No overlapping projects found.');
        return;
      }

      const uniqueProjects = new Map();

      data.forEach((pair: any) => {
        [pair.Project1_ID, pair.Project2_ID].forEach((id, index) => {
          if (!uniqueProjects.has(id)) {
            uniqueProjects.set(id, {
              proj_id: id,
              department: pair[`Project${index + 1}_Department`],
              proj_title: pair[`Project${index + 1}_Title`],
              location: pair[`Project${index + 1}_Location`],
              description: pair[`Project${index + 1}_Description`],
              latitude: pair[`Project${index + 1}_Latitude`],
              longitude: pair[`Project${index + 1}_Longitude`],
              start_date: pair[`Project${index + 1}_Start`],
              end_date: pair[`Project${index + 1}_End`],
              estimated_budget: pair[`Project${index + 1}_Budget`],
              status:pair[`Project${index + 1}_Status`],
            });
          }
        });
      });

      this.overlappingProjects = Array.from(uniqueProjects.values());
      console.log('Formatted overlapping projects:', this.overlappingProjects);
      
    },
    (error) => {
      console.error('Error fetching overlapping projects:', error);
    }
  );
}
}

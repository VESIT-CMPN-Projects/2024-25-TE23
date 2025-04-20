import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-view-project-requests',
  templateUrl: './view-project-requests.component.html',
  styleUrls: ['./view-project-requests.component.scss'],
})
export class ViewProjectRequestsComponent implements OnInit {
projects!:any
approvedProjects: any[] = [];
  projectsRequests!:any
  isApproved=false
  constructor(private projService:ProjectService) {}

  ngOnInit(): void {
    this.fetchProjectRequests(),
    
    // this.fetchOverlappingProjects(),

    this.projService.fetchAllProjects().subscribe((value)=>this.projects=value)
  }

  fetchProjectRequests(){
    this.projService.fetchProjectRequests().subscribe((value)=>{
      this.projectsRequests=value
      console.log(this.projectsRequests)


      this.approvedProjects = this.projectsRequests.filter((p:any) => {
        // console.log(p.isApproved)
        return !p.isApproved
      });
    })
  }

  // In your component
// overlappingProjects:any = [];

// // fetchOverlappingProjects() {
// //   // This would be the actual API call to your backend
// //   // Using your SQL query to find overlapping projects
// //   this.projService.fetchProjectRequests().subscribe(
// //     (data:any) => {
// //       console.log(data)
// //       // Format the data for display
// //       // We need to extract unique projects from the overlapping pairs
// //       const uniqueProjects = new Map();
      
// //       // Process each pair of overlapping projects
// //       data.forEach((pair:any) => {
// //         // Add first project from pair if not already added
// //         if (!uniqueProjects.has(pair.Project1_ID)) {
// //           uniqueProjects.set(pair.Project1_ID, {
// //             proj_id: pair.Project1_ID,
// //             department: pair.Project1_Department, // You'll need to include this in your query
// //             proj_title: pair.Project1_Title,
// //             location: pair.Project1_Location, // You'll need to include this in your query
// //             description: pair.Project1_Description, // You'll need to include this in your query
// //             latitude: pair.Project1_Latitude, // You'll need to include this in your query
// //             longitude: pair.Project1_Longitude, // You'll need to include this in your query
// //             start_date: pair.Project1_Start,
// //             end_date: pair.Project1_End,
// //             estimated_budget: pair.Project1_Budget, // You'll need to include this in your query
// //           });
// //         }
        
// //         // Add second project from pair if not already added
// //         if (!uniqueProjects.has(pair.Project2_ID)) {
// //           uniqueProjects.set(pair.Project2_ID, {
// //             proj_id: pair.Project2_ID,
// //             department: pair.Project2_Department, // You'll need to include this in your query
// //             proj_title: pair.Project2_Title,
// //             location: pair.Project2_Location, // You'll need to include this in your query
// //             description: pair.Project2_Description, // You'll need to include this in your query
// //             latitude: pair.Project2_Latitude, // You'll need to include this in your query
// //             longitude: pair.Project2_Longitude, // You'll need to include this in your query
// //             start_date: pair.Project2_Start,
// //             end_date: pair.Project2_End,
// //             estimated_budget: pair.Project2_Budget, // You'll need to include this in your query
// //           });
// //         }
// //       });
      
// //       // Convert the Map to an array for the template
// //       this.overlappingProjects = Array.from(uniqueProjects.values());
// //     },
// //     (error) => {
// //       console.error('Error fetching overlapping projects:', error);
// //     }
// //   );
// // }

// fetchOverlappingProjects() {
//   this.overlappingProjects = []; // Ensure it starts as an empty array
//   this.projService.fetchProjectRequests().subscribe(
//     (data: any) => {
//       console.log('Raw overlapping projects data:', data); // Debugging log

//       if (!data || data.length === 0) {
//         console.warn('No overlapping projects found.');
//         return;
//       }

//       const uniqueProjects = new Map();

//       data.forEach((pair: any) => {
//         [pair.Project1_ID, pair.Project2_ID].forEach((id, index) => {
//           if (!uniqueProjects.has(id)) {
//             uniqueProjects.set(id, {
//               proj_id: id,
//               department: pair[`Project${index + 1}_Department`],
//               proj_title: pair[`Project${index + 1}_Title`],
//               location: pair[`Project${index + 1}_Location`],
//               description: pair[`Project${index + 1}_Description`],
//               latitude: pair[`Project${index + 1}_Latitude`],
//               longitude: pair[`Project${index + 1}_Longitude`],
//               start_date: pair[`Project${index + 1}_Start`],
//               end_date: pair[`Project${index + 1}_End`],
//               estimated_budget: pair[`Project${index + 1}_Budget`],
//             });
//           }
//         });
//       });

//       this.overlappingProjects = Array.from(uniqueProjects.values());
//       console.log('Formatted overlapping projects:', this.overlappingProjects);
      
//     },
//     (error) => {
//       console.error('Error fetching overlapping projects:', error);
//     }
//   );
// }


  approveProject(proj_id: string): void {
    const project = this.projects.find((p:any) => p.proj_id === proj_id);
    if (project) {
      project.status = 'approved'; 
      alert('Project ' + proj_id + ' has been approved!');
      this.projService.projectApproved(proj_id).subscribe((value:any)=>{
        this.isApproved=true;
      });
      this.isApproved=true;
    }
  }

  rejectProject(proj_id: string): void {
    const project = this.projects.find((p:any) => p.proj_id === proj_id);
    if (project) {
      project.status = 'rejected'; 
      alert('Project ' + proj_id + ' has been rejected!');

      this.projService.projectRejected(proj_id).subscribe((value:any)=>{
        this.isApproved=false;
      });
    }
    this.isApproved=false
  }
}

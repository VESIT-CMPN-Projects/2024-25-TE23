// MODULES //
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

// SERVICES //
import { NotificationService } from 'src/app/services/notification.service';
import { ProjectService } from 'src/app/services/project.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})



export class DashboardComponent implements OnInit {

  ongoingProjects: any;
  completedProjects: any;
  pendingRequestsCount = 0;
  totalRequestsCount = 0;
  recentNotifications: any;
  pendingProjects!:any
  inprogressProjects!:any

  constructor(
    private projectService: ProjectService,
    private notificationService: NotificationService
  ) {}
notifications!:any
  projects!:any
  ngOnInit(): void {


    this.loadPendingRequestsCount();
    
    // this.loadOngoingProjects();
    // this.loadCompletedProjects();
    this.fetchAllProjs();
    // this.loadPendingRequests();
    // this.loadTotalRequests();
    // // this.loadRecentNotifications();
    // this.renderProjectPieChart();
    // this.renderDepartmentWiseChart(); 
    // this.renderLocationBarChart();
    // this.renderBudgetLineChart();

    this.loadProjectStatusChart();
    // this.loadDepartmentWiseChart();
    // this.loadLocationChart();
    this.loadBudgetChart();



    this.projectService.fetchApprovedProjects().subscribe((value:any)=>{
      console.log(value)
      this.notifications=value})

      

  }

  fetchAllProjs(){
    this.projectService.fetchAllProjects().subscribe((value)=>{
      this.projects=value
      console.log(this.projects)

      this.completedProjects = this.projects.filter((project:any) => project.proj_status === 'completed');
this.pendingProjects = this.projects.filter((project:any) => project.proj_status === 'pending');
this.inprogressProjects = this.projects.filter((project:any) => project.proj_status === 'in-progress');
    })
  }

  // loadOngoingProjects() {
  //   this.projectService.getOngoingProjects().subscribe((projects) => {
  //     this.ongoingProjects = projects;
  //   });
  // }

  // loadCompletedProjects() {
  //   this.projectService.getCompletedProjects().subscribe((projects) => {
  //     this.completedProjects = projects;
  //   });
  // }

  // loadPendingRequests() {
  //   this.projectService.getPendingRequestsCount().subscribe((count) => {
  //     this.pendingRequestsCount = count;
  //   });
  // }

  loadPendingRequestsCount() {
    this.projectService.fetchPendingRequestsCount().subscribe((data: any) => {
      console.log('Pending Requests:', data.pendingRequests);
      this.totalRequestsCount = data.pendingRequests;   // Set the count
    });
  }

  // loadTotalRequests() {
  //   this.projectService.getTotalRequestsCount().subscribe((count) => {
  //     this.totalRequestsCount = count;
  //   });
  // }

  // // loadRecentNotifications() {
  // //   this.notificationService.getRecentNotifications().subscribe((notifications) => {
  // //     this.recentNotifications = notifications;
  // //   });
  // // }

  getFlagColor(notification: any) {
    return notification.hasOverlap ? 'fa fa-flag red-flag' : 'fa fa-flag green-flag';
  }

  // private renderProjectPieChart(): void {
  //   new Chart('projectPieChart', {
  //     type: 'pie',
  //     data: {
  //       labels: ['Ongoing', 'Completed', 'Pending'],
  //       datasets: [
  //         {
  //           data: [12, 8, 5],
  //           backgroundColor: ['#2196f3', '#4caf50', '#ff9800'],
  //         },
  //       ],
  //     },
  //   });
  // }




// 



private loadProjectStatusChart(): void {
  this.projectService.getProjectStatusCounts().subscribe((data) => {
    new Chart('projectPieChart', {
      type: 'pie',
      data: {
        labels: Object.keys(data),
        datasets: [
          {
            data: Object.values(data),
            backgroundColor: ['#2196f3', '#4caf50', '#ff9800'],
          },
        ],
      },
    });
  });
}

// private loadDepartmentWiseChart(): void {
//   this.projectService.getDepartmentWiseProjects().subscribe((data) => {
//     const labels = data.map((d: any) => d.department);
//     const counts = data.map((d: any) => d.count);

//     new Chart('departmentBarChart', {
//       type: 'bar',
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: 'Projects',
//             data: counts,
//             backgroundColor: '#2196f3',
//           },
//         ],
//       },
//     });
//   });
// }

// private loadLocationChart(): void {
//   this.projectService.getLocationWiseProjects().subscribe((data) => {
//     const labels = data.map((d: any) => d.location);
//     const counts = data.map((d: any) => d.count);

//     new Chart('locationBarChart', {
//       type: 'bar',
//       data: {
//         labels: labels,
//         datasets: [
//           {
//             label: 'Projects',
//             data: counts,
//             backgroundColor: ['#2196f3', '#4caf50', '#ff9800'],
//           },
//         ],
//       },
//     });
//   });
// }

private loadBudgetChart(): void {
  this.projectService.getBudgetSpent().subscribe((data) => {
    const labels = data.map((d: any) => d.project);
    const budgets = data.map((d: any) => d.budget);

    new Chart('budgetPieChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Budget Spent',
            data: budgets,
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            fill: true,
          },
        ],
      },
    });
  });
}



}

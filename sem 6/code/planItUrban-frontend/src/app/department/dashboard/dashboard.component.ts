// MODULES //
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

// OTHERS //
import { Chart } from 'chart.js/auto';
import { CookieService } from 'ngx-cookie-service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';
import { OfficerService } from 'src/app/services/officer.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  deptId: string | null = null;
   isDownloading: boolean = false; 
   projects!:any
   recentTasks!:any
   officers!:any
   countTask:number=0
   countProjs:number=0
   countOfficers:number=0

  constructor(private http: HttpClient, private cookieService: CookieService,private projService:ProjectService,private taskService:TaskService,private officerService:OfficerService,private route: ActivatedRoute) {}


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
    const deptId = params['id']; // Fetch department ID from URL
    this.cookieService.set('dept_id', deptId); // Store in cookie
  });
  
   this.getLoggedInDepartmentId();
    this.renderBudgetPieChart();
    this.renderTaskBarChart();
    this.fetchProjects(Number(this.deptId))

    //fetchallrecenttasks and then count
    this.taskService.fetchAllRecentTasks().subscribe((value)=>{
      this.recentTasks=value
      console.log(this.recentTasks)

      this.recentTasks.forEach((task:any)=>{
        console.log(task)
        this.countTask++;
      })
    })

    //fetch officersbydept
    this.officerService.fetchOfficersByDept(Number(this.deptId)).subscribe((value)=>{
      console.log(value)
      this.officers=value

      this.officers.forEach((officer:any)=>{
        this.countOfficers++;
      })
    })
}


 private getLoggedInDepartmentId(): void {
    this.deptId = this.cookieService.get('user_id'); 
    console.log('Logged-in dept_id:', this.deptId);
  }



downloadReport() {
  if (!this.deptId) {
    console.error("Department ID not found");
    return;
  }

  this.isDownloading = true;
  const apiUrl = `http://localhost:8080/reports/generate/${this.deptId}`;

  this.http.get(apiUrl, { responseType: 'blob' }).subscribe(
    (blob) => {
      if (blob.size === 0) {
         this.isDownloading = false;
        
        Swal.fire({
          icon: "warning",
          title: "No Projects Found",
          text: "There are no projects available for this department. Report download is not available.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
          backdrop: true, 
        });

        return;
      }
      

  
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = `department_${this.deptId}_report.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.isDownloading = false; 

      
      Swal.fire({
        icon: "success",
        title: "Download Complete",
        text: "Your department report has been downloaded successfully.",
        confirmButtonColor: "#28a745",
        confirmButtonText: "OK",
        backdrop: true,
      });
    },
    (error) => {
      console.error("Report download failed", error);

     
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "An error occurred while generating the report. Please try again later.",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
        backdrop: true,
      });

      this.isDownloading = false; 
    }
  );
}



  private renderTaskBarChart(): void {
    this.http.get(`http://localhost:8080/tasks/progress`)
      .subscribe((response: any) => {
        new Chart('taskBarChart', {
          type: 'bar',
          data: {
            labels: response.labels,
            datasets: [
              {
                label: 'Task Count',
                data: response.taskCounts,
                backgroundColor: '#2196f3',
              },
              {
                label: 'Avg Progress (%)',
                data: response.avgProgress,
                backgroundColor: '#4caf50',
              }
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: 'top' },
            },
            scales: {
              x: { title: { display: true, text: 'Task Status' } },
              y: { title: { display: true, text: 'Count / Progress (%)' } },
            },
          },
        });
      });
  }


private generateColors(count: number): string[] {
  const pastelColors: string[] = [
    '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', 
    '#C4E17F', '#F7C6C7', '#B9F6CA', '#FFD3B6', '#D4A5A5'
  ];

  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(pastelColors[i % pastelColors.length]);
  }
  return colors;
}


private createPieChart(labels: string[], data: number[]): void {
  const ctx = document.getElementById('budgetPieChart') as HTMLCanvasElement;

  if (!ctx) {
    console.error("Canvas element not found.");
    return;
  }

  const backgroundColors = this.generateColors(data.length); 

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Budget Distribution',
        data: data,
        backgroundColor: backgroundColors,  
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
      },
    },
  });
}


private renderBudgetPieChart(): void {
  const deptId = this.deptId 

  this.http.get(`http://localhost:8080/budget/${deptId}`)
    .subscribe(
      (response: any) => {
        console.log("API Response:", response);
        
        if (response && response.labels && response.budgetValues) {
          this.createPieChart(response.labels, response.budgetValues);
        } else {
          console.error("Empty budget data received.");
        }
      },
      (error) => {
        console.error("API Error:", error);
      }
    );
}




  fetchProjects(dept_id:number){
    this.projService.fetchProjects(dept_id).subscribe((value)=>{
      this.projects=value
      console.log("projects fetched from db")

      this.projects.forEach((project:any)=>{
        this.countProjs++;
      })
    })
  }
}

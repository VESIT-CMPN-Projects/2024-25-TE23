// MODULES //
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

// OTHERS //
import { Chart } from 'chart.js/auto';
import { CookieService } from 'ngx-cookie-service';
import { OfficerService } from 'src/app/services/officer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  officer_id!: number;
  assignedTasks!: any;
  assignedTasksCount: number = 0;

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private officerService: OfficerService
  ) {}

  ngOnInit(): void {
    this.officer_id = Number(this.cookieService.get('user_id')) || 0;

    if (!this.officer_id) {
      console.error('Invalid officer_id: ', this.officer_id);
      return;
    }

    this.fetchAssignedTasks(this.officer_id);
  }

  fetchAssignedTasks(officerId: number) {
    this.officerService.fetchAssignedTasks(officerId).subscribe((tasks) => {
      this.assignedTasks = tasks;
      this.assignedTasksCount = tasks.length;

      if (tasks.length) {
        this.renderTaskProgressPieChart(tasks);
        this.renderTaskCompletionBarChart(tasks);
      }
    });
  }

  private generateRandomColor(): string {
    const hue = Math.floor(Math.random() * 360); 
    const pastel = `hsl(${hue}, 100%, 85%)`; 
    return pastel;
  }


  private renderTaskProgressPieChart(tasks: any[]): void {
    const labels = tasks.map(
      (task) => `${task.task_title} (${task.task_progress}%)`
    );
    const data = tasks.map((task) => task.task_progress);

    
    const backgroundColors = tasks.map(() => this.generateRandomColor());

    new Chart('taskProgressPieChart', {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColors,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              label: function (context) {
                const taskIndex = context.dataIndex;
                const task = tasks[taskIndex];
                return `${task.task_title}: ${task.task_progress}%`;
              },
            },
          },
        },
      },
    });
  }


  private renderTaskCompletionBarChart(tasks: any[]): void {
    const completed = tasks.filter((task) => task.task_progress === 100).length;
    const inProgress = tasks.filter(
      (task) => task.task_progress > 0 && task.task_progress < 100
    ).length;
    const pending = tasks.filter((task) => task.task_progress === 0).length;

    new Chart('taskCompletionBarChart', {
      type: 'bar',
      data: {
        labels: ['Completed', 'In Progress', 'Pending'],
        datasets: [
          {
            label: 'Task Completion',
            data: [completed, inProgress, pending],
            backgroundColor: ['#4caf50', '#facc15', '#ef4444'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { title: { display: true, text: 'Task Status' } },
          y: { title: { display: true, text: 'Number of Tasks' } },
        },
      },
    });
  }
}

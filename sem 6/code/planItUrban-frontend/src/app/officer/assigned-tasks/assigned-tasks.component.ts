// MODULES //
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-assigned-tasks',
  templateUrl: './assigned-tasks.component.html',
  styleUrls: ['./assigned-tasks.component.scss'],
})
export class AssignedTasksComponent implements OnInit {
  assignedTasks!: any;
  officer_id!: number;

  constructor(
    private taskService: TaskService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.officer_id = Number(this.cookieService.get('user_id')) ?? 0;
    console.log('Officer ID:', this.officer_id);
    this.fetchTasks(this.officer_id);
  }


  fetchTasks(officer_id: number) {
    this.taskService.fetchTasks(officer_id).subscribe((value) => {
      console.log('Tasks fetched:', value);
      this.assignedTasks = value;
    });
  }

  
  updateProgress(taskId: number, progress: number) {
  const status = this.getUpdatedStatus(progress);

  const updatedTask = {
    officer_id: this.officer_id,
    task_progress: progress,
    task_status: status
  };

  this.taskService.updateTaskProgress(taskId, updatedTask).subscribe(() => {
    console.log(`Task ${taskId} updated: ${progress}% - ${status}`);
    this.fetchTasks(this.officer_id);
  });
}



  getUpdatedStatus(progress: number): string {
    if (progress === 0) {
      return 'Pending';
    } else if (progress > 0 && progress < 100) {
      return 'In Progress';
    } else if (progress === 100) {
      return 'Completed';
    } else {
      return '';
    }
  }

  getTaskStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'completed';
      case 'in progress':
        return 'in-progress';
      case 'pending':
        return 'pending';
      default:
        return '';
    }
  }
}

// MODULES //
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  recentTasks!:any
  // recentTasks = [
  //   {
  //     task_title: 'Task 1: Design Urban Report',
  //     task_desc: 'Complete the draft report for the urban planning department.',
  //     task_start_date: new Date(),
  //     task_end_date: new Date(),
  //     task_status: 'in-progress',
  //   },
  //   {
  //     task_title: 'Task 2: Review Community Input',
  //     task_desc: 'Review and respond to public comments on urban development.',
  //     task_start_date: new Date(),
  //     task_end_date: new Date(),
  //     task_status: 'completed',
  //   },
  //   // Add more tasks here
  // ];

  // notifications = [
  //   {
  //     message: 'You have been assigned a new task: Design Urban Report',
  //     time: new Date(),
  //   },
  //   {
  //     message: 'Task "Review Community Input" has been completed.',
  //     time: new Date(),
  //   },
  //   // Add more notifications here
  // ];

  notifications!:any

  constructor(private taskService:TaskService,private cookieService:CookieService) {}

  ngOnInit(): void {
    const officer_id = Number(this.cookieService.get("user_id")) ?? -1
    this.taskService.fetchTasks(officer_id).subscribe((value)=>{
      this.notifications=value
      console.log(this.notifications)
  })
    
    this.taskService.fetchRecentTasks(officer_id).subscribe((value)=>{
      this.recentTasks=value
      console.log(this.recentTasks)
  })

  }

  // This method adds the right class based on the task status
  getTaskStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'completed';
      case 'in-progress':
        return 'in-progress';
      case 'Pending':
        return 'pending';
      default:
        return '';
    }
  }
}

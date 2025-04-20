import { Component } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
// notifications = [
//     {
//       notification_id: 1,
//       notification_title: 'Project Alpha Approved',
//       notification_description:
//         'Project Alpha has been approved and is ready to start.',
//       received_at: '2025-01-10 14:30:00',
//     },
//     {
//       notification_id: 2,
//       notification_title: 'Overlapping Project Alert',
//       notification_description:
//         'Project Beta overlaps with Project Gamma. Immediate attention required.',
//       received_at: '2025-01-12 10:45:00',
//     },
//     {
//       notification_id: 3,
//       notification_title: 'Pending Project Requests',
//       notification_description: '3 pending project requests need your review.',
//       received_at: '2025-01-13 09:15:00',
//     },
//   ];
notifications!:any

constructor(private projService:ProjectService){}

ngOnInit(){
  
  this.projService.fetchApprovedProjects().subscribe((value)=>{
    console.log(value)
    this.notifications=value})
}


}

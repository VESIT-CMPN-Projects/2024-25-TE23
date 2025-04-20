// MODULES //
import { Injectable } from '@angular/core';

// OTHERS //
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Dummy notifications
  private notifications = [
    {
      notification_id: 1,
      notification_title: 'Project Alpha Approved',
      notification_description:
        'Project Alpha has been approved and is ready to start.',
      received_at: '2025-01-10 14:30:00',
    },
    {
      notification_id: 2,
      notification_title: 'Overlapping Project Alert',
      notification_description:
        'Project Beta overlaps with Project Gamma. Immediate attention required.',
      received_at: '2025-01-12 10:45:00',
    },
    {
      notification_id: 3,
      notification_title: 'Pending Project Requests',
      notification_description: '3 pending project requests need your review.',
      received_at: '2025-01-13 09:15:00',
    },
  ];

  constructor() {}

  // Method to get all notifications
  getNotifications(): Observable<any[]> {
    return of(this.notifications);
  }

  // Method to get all notifications
  getRecentNotifications(): Observable<any[]> {
    return of(this.notifications);
  }

  // Method to get a notification by ID
  getNotificationById(notificationId: number): Observable<any> {
    const notification = this.notifications.find(
      (n) => n.notification_id === notificationId
    );
    return of(notification || null);
  }
}

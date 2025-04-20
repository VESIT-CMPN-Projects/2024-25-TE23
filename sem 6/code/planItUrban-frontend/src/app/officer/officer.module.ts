// MODULES //
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfficerRoutingModule } from './officer-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// COMPONENTS //
import { OfficerSideNavComponent } from './officer-side-nav/officer-side-nav.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { MapComponent } from './map/map.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';

@NgModule({
  declarations: [
    OfficerSideNavComponent,
    ProfileComponent,
    DashboardComponent,
    ViewProjectsComponent,
    MapComponent,
    NotificationsComponent,
    AssignedTasksComponent,
  ],
  imports: [
    CommonModule,
    OfficerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class OfficerModule {}

// MODULES //
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DepartmentRoutingModule } from './department-routing.module';

// COMPONENTS //
import { DeptSideNavComponent } from './dept-side-nav/dept-side-nav.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ViewAllProjectsComponent } from './view-all-projects/view-all-projects.component';
import { MapComponent } from './map/map.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AddOfficerComponent } from './add-officer/add-officer.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { ViewAllOfficersComponent } from './view-all-officers/view-all-officers.component';

@NgModule({
  declarations: [
    DeptSideNavComponent,
    ProfileComponent,
    DashboardComponent,
    AddProjectComponent,
    ViewAllProjectsComponent,
    MapComponent,
    NotificationsComponent,
    AddOfficerComponent,
    AddTaskComponent,
    ChatbotComponent,
    ViewAllOfficersComponent
  ],
  imports: [CommonModule, DepartmentRoutingModule, ReactiveFormsModule, FormsModule],
})
export class DepartmentModule {}

// MODULES //
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENTS //
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { ViewAllProjectsComponent } from './view-all-projects/view-all-projects.component';
import { MapComponent } from './map/map.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AddOfficerComponent } from './add-officer/add-officer.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { ViewAllOfficersComponent } from './view-all-officers/view-all-officers.component';

// Import the components of the department module

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default route for department module
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'add-project', component: AddProjectComponent },
  { path: 'view-projects', component: ViewAllProjectsComponent },
  { path: 'map', component: MapComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'add-officer', component: AddOfficerComponent },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'view-officers', component: ViewAllOfficersComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentRoutingModule {}

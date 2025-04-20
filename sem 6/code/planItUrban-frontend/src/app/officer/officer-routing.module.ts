// MODULES //
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENTS //
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewProjectsComponent } from './view-projects/view-projects.component';
import { MapComponent } from './map/map.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AssignedTasksComponent } from './assigned-tasks/assigned-tasks.component';
import { OfficerSideNavComponent } from './officer-side-nav/officer-side-nav.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  { path: 'officer-side-nav', component: OfficerSideNavComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'view-projects', component: ViewProjectsComponent },
  { path: 'map', component: MapComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'assigned-tasks', component: AssignedTasksComponent },
  { path: '', redirectTo: '/officer/dashboard', pathMatch: 'full' }, // Default to dashboard
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OfficerRoutingModule {}

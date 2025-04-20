import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewAllProjectsComponent } from './view-all-projects/view-all-projects.component';
import { MapComponent } from './map/map.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { CommissionerSideNavComponent } from './commissioner-side-nav/commissioner-side-nav.component';
import { ViewProjectRequestsComponent } from './view-project-requests/view-project-requests.component';


const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  { path: 'commissioner-side-nav', component: CommissionerSideNavComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'view-all-projects', component: ViewAllProjectsComponent },
  { path: 'view-project-requests', component: ViewProjectRequestsComponent },
  { path: 'map', component: MapComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: '', redirectTo: '/commissioner/dashboard', pathMatch: 'full' }, 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommissionerRoutingModule {}

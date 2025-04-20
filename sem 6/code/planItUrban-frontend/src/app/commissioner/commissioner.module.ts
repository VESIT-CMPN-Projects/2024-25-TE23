// MODULES //
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionerRoutingModule } from './commissioner-routing.module';

// COMPONENTS //
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewAllProjectsComponent } from './view-all-projects/view-all-projects.component';
import { CommissionerSideNavComponent } from './commissioner-side-nav/commissioner-side-nav.component';
import { ProfileComponent } from './profile/profile.component';
import { MapComponent } from './map/map.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewProjectRequestsComponent } from './view-project-requests/view-project-requests.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ViewAllProjectsComponent,
    CommissionerSideNavComponent,
    ProfileComponent,
    MapComponent,
    NotificationsComponent,
    ViewProjectRequestsComponent,

  ],
  imports: [
    CommonModule,
    CommissionerRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    DashboardComponent,
    ViewAllProjectsComponent,
    ProfileComponent,
    MapComponent,
    NotificationsComponent,
    ViewProjectRequestsComponent
  ]
})
export class CommissionerModule { }

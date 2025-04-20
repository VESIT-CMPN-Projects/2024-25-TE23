// MODULES //
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// COMPONENTS //
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';


const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Default route
  { path: 'login', component: LoginComponent }, // Direct route to LoginComponent
  { path: 'sign-up', component: SignupComponent }, // Direct route to SignupComponent


  // Lazy loading for the Department module
  {
    path: 'department',
    loadChildren: () =>
      import('./department/department.module').then((m) => m.DepartmentModule),
  },
  {
    path: 'officer',
    loadChildren: () =>
      import('./officer/officer.module').then((m) => m.OfficerModule),
  },
  {
    path: 'commissioner',
    loadChildren: () =>
      import('./commissioner/commissioner.module').then((m) => m.CommissionerModule),
  },
  // Wildcard route for invalid paths
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

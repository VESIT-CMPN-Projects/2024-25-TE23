import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  validCredentials = true;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {}

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  login() {
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe((value) => {
      console.log(value);
      if (value.validYN === 1) {
        this.validCredentials = true;
        this.cookieService.set('user_id', value.user_id);
        this.cookieService.set('role', value.role);
        this.cookieService.set('isLoggedIn', '1'); // for logout functionality

        if (value.role === 'department') {
           this.cookieService.set('dept_id', value.departmentId);
          this.router.navigate(['/department']);
        } else if (value.role === 'officer') {
          this.router.navigate(['/officer']);
        } else if (value.role === 'commissioner') {
          this.router.navigate(['/commissioner']);
        }

        console.log('Login successful');
      } else {
        this.validCredentials = false;
        console.log('Login unsuccessful');
      }
    });
  }
}

// MODULES //
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  departmentForm!: FormGroup;
  loggedInDepartment:any
  dept_id!:number
  constructor(private fb: FormBuilder,private authService:AuthService,private cookieService:CookieService) {}

  ngOnInit(): void {
    this.dept_id=Number(this.cookieService.get('user_id')) ?? 0
    console.log(this.dept_id)
    // Initialize form with default values (mock data for autofill)
    this.departmentForm = this.fb.group({
      dept_id: [{ value: '', disabled: true }], // Initially empty
      dept_name: [''],
      dept_code: [''],
      dept_state: [''],
    });

    this.fetchLoggedInDepartment(this.dept_id)

    
  }

  fetchLoggedInDepartment(dept_id:number){
    this.authService.fetchLoggedInDepartment(dept_id).subscribe((value)=>{
      console.log(value)
      this.loggedInDepartment=value  //loggedInDepartment ye aise ek variable m value ko store krwaya fir uske patch kiye values
      console.log(this.loggedInDepartment)

      this.departmentForm.patchValue({
        dept_id: this.loggedInDepartment.dept_id,
        dept_name: this.loggedInDepartment.dept_name,
        dept_code: this.loggedInDepartment.dept_code,
        dept_state: this.loggedInDepartment.dept_state,
      });
    })
  }

  onSubmit(): void {
    if (this.departmentForm.valid) {
      const updatedData = this.departmentForm.getRawValue(); // Includes disabled fields like dept_id
      console.log('Updated Department Details:', updatedData);
      alert('Department details updated successfully!');
      // Call API or service to save the updated data
    } else {
      alert('Please correct the errors in the form.');
    }
  }

  
}

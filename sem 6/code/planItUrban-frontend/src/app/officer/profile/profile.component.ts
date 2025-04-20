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
  officerForm!: FormGroup;
  officerid!:number
  loggedInOfficer!:any
  constructor(private fb: FormBuilder,private authService:AuthService,private cookieService:CookieService) {
    this.officerid=Number(this.cookieService.get('user_id')) ?? 0
    console.log(this.officerid)

    this.fetchLoggedInOfficer(this.officerid)
  }

  ngOnInit(): void {
    // Initialize form with default values (mock data for autofill)
    this.officerForm = this.fb.group({
      officer_name: ['Raghav Joshi', [Validators.required]], // Default name
      officer_email: [
        'raghavjoshi22@gmail.com',
        [Validators.required, Validators.email],
      ], // Default email
      officer_dept: ['Urban Development', [Validators.required]], // Default department
    });
  }

  // Submit handler for form submission
  onSubmit(): void {
    if (this.officerForm.valid) {
      const updatedOfficerData = this.officerForm.getRawValue(); // Get form data, including disabled fields if any
      console.log('Updated Officer Profile:', updatedOfficerData);
      alert('Officer profile updated successfully!');
      // Call API or service to save the updated data
    } else {
      alert('Please correct the errors in the form.');
    }
  }

  fetchLoggedInOfficer(officerid:number){
    this.authService.fetchLoggedInOfficer(officerid).subscribe((value)=>{
      console.log(value)
      this.loggedInOfficer=value  //loggedInDepartment ye aise ek variable m value ko store krwaya fir uske patch kiye values
      console.log(this.loggedInOfficer)

      this.officerForm.patchValue({
        officer_name: this.loggedInOfficer.officer_name,
        officer_email: this.loggedInOfficer.officer_email,
        officer_dept: this.loggedInOfficer.officer_dept
      });
    })
  }
}

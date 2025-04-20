import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  commissionerForm!: FormGroup;
  commisioner_id!:number
  loggedInCommissioner!:any
  constructor(private fb: FormBuilder,private cookieService:CookieService,private authService:AuthService) {}

  ngOnInit(): void {
    this.commisioner_id=Number(this.cookieService.get('user_id')) ?? 0
    console.log(this.commisioner_id)

    this.commissionerForm = this.fb.group({
      commissioner_name: [''],
      commissioner_email: [
        ''
      ], 
    });

    this.fetchLoggedInCommissioner(this.commisioner_id)


  }

  fetchLoggedInCommissioner(commisioner_id:number){
    this.authService.fetchLoggedInCommissioner(commisioner_id).subscribe((value)=>{
      this.loggedInCommissioner=value

      this.commissionerForm.patchValue({
        commissioner_name:this.loggedInCommissioner.c_username,
        commissioner_email:this.loggedInCommissioner.c_email
      })
    })
  }

  onSubmit(): void {
    if (this.commissionerForm.valid) {
      const updatedCommissionerData = this.commissionerForm.getRawValue(); 
      console.log('Updated Commissioner Profile:', updatedCommissionerData);
      alert('Commissioner profile updated successfully!');
      // Call API or service to save the updated data
    } else {
      alert('Please correct the errors in the form.');
    }
  }

}


// MODULES //
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  constructor(private authService:AuthService){}
  officer: {
    officer_name: string;
    officer_email: string;
    officer_dept: string;
    idProof: File | null;
    cert: File | null;
  } = {
    officer_name: '',
    officer_email: '',
    officer_dept: '',
    idProof: null,
    cert: null,
  };

  officerForm=new FormGroup({
    officer_name:new FormControl( '', [Validators.required]),
    officerEmail:new FormControl( '', [Validators.required, Validators.email]),
    officer_dept:new FormControl( '', [Validators.required])
    // govt_identity_proof: new FormControl('', [Validators.required]),
    // certificate_of_incorporation:new FormControl( '', [Validators.required])
  })

  handleFileUpload(event: Event, type: 'idProof' | 'cert') {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.officer[type] = input.files[0];
    }
  }

  registerOfficer() {
    // console.log(formData)
    // if (this.officerForm.valid) {
      const formData = this.officerForm.value;
      console.log(formData)
      
      this.authService.registerOfficer(formData).subscribe(
        (response) => {
          alert('Officer details submitted for approval.');
        }
        // () => {
        //   alert('Error submitting officer details.');
        // }
      );
    
  }


  
}

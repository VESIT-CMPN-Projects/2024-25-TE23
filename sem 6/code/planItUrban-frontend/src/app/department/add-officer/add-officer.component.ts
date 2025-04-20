// // MODULES //
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { OfficerService } from 'src/app/services/officer.service';

// @Component({
//   selector: 'app-add-officer',
//   templateUrl: './add-officer.component.html',
//   styleUrls: ['./add-officer.component.scss'],
// })
// export class AddOfficerComponent implements OnInit {
//   officerForm!: FormGroup;

//   constructor(private fb: FormBuilder,private officerService:OfficerService) {}

//   ngOnInit(): void {
//     this.officerForm = this.fb.group({
//       officer_name: ['', Validators.required],
//       officer_email: ['', [Validators.required, Validators.email]],
//       officer_dept: ['', Validators.required],
//       govt_identity_proof: ['', Validators.required],
//       certificate_of_incorporation: ['', Validators.required],
//       attestation_officer_proof: ['', Validators.required],
//     });
//   }

//   registerOfficer(){  
//     this.officerService.registerOfficer(this.officerForm.value).subscribe(()=>console.log("officer inserted"))
//  }

//   onFileChange(event: any, controlName: string): void {
//     const file = event.target.files[0];
//     if (file) {
//       this.officerForm.patchValue({
//         [controlName]: file,
//       });
//     }
//   }
// }



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfficerService } from 'src/app/services/officer.service';
import { CookieService } from 'ngx-cookie-service';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-add-officer',
  templateUrl: './add-officer.component.html',
  styleUrls: ['./add-officer.component.scss'],
})
export class AddOfficerComponent implements OnInit {
  officerForm!: FormGroup;
  deptName: string = '';

  constructor(
    private fb: FormBuilder,
    private officerService: OfficerService,
    private cookieService: CookieService,
    private deptService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getLoggedInDepartment();
  }

  private initializeForm(): void {
    this.officerForm = this.fb.group({
      officer_name: ['', Validators.required],
      officerEmail: ['', [Validators.required, Validators.email]],
      officer_dept: [{ value: '', disabled: true }, Validators.required],
      govt_identity_proof: [''],
      certificate_of_incorporation: [''],
      attestation_officer_proof: [''],
    });
  }

  private getLoggedInDepartment(): void {
    const deptId = this.cookieService.get('user_id');
    if (deptId) {
      this.deptService.getDepartmentById(deptId).subscribe(
        (response: any) => {
          if (response && response.dept_name) {
            this.deptName = response.dept_name;
            this.officerForm.patchValue({ officer_dept: this.deptName });
          }
        },
        (error) => {
          console.error('Error fetching department details', error);
        }
      );
    }
  }

  registerOfficer(): void {
    if (this.officerForm.valid) {
       console.log("Form Data Before Submission:", this.officerForm.getRawValue()); 
    const formData = this.officerForm.getRawValue();
      this.officerService.registerOfficer(formData).subscribe(() => console.log('Officer inserted'));
    }
  }

  onFileChange(event: any, controlName: string): void {
    const file = event.target.files[0];
    if (file) {
      this.officerForm.patchValue({
        [controlName]: file,
      });
    }
  }
}





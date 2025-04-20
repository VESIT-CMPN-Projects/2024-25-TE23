// MODULES //
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
})
export class AddProjectComponent implements OnInit {
  projectForm!: FormGroup;
  dept_id!:number
  constructor(private fb: FormBuilder,private projectService:ProjectService,private cookieService:CookieService) {}

  ngOnInit(): void {
    // this.dept_id=Number(this.cookieService.get('user_id')) ?? 0
    // console.log(this.dept_id)
    this.projectForm = this.fb.group({
      proj_title: ['', Validators.required],
      proj_location: ['', Validators.required],
      proj_desc: ['', Validators.required],
      proj_latitude: [
        '',
        [Validators.required, Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')],
      ],
      proj_longitude: [
        '',
        [Validators.required, Validators.pattern('^[+-]?([0-9]*[.])?[0-9]+$')],
      ],
      proj_start_date: ['', Validators.required],
      proj_end_date: ['', Validators.required],
      proj_estimated_budget: ['', [Validators.required, Validators.min(1)]],
      proj_status: ['', Validators.required],
    });
  }

  // onSubmit(): void {
  //   if (this.projectForm.valid) {
  //     console.log(this.projectForm.value);
  //     // Handle form submission logic here
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }


  registerProject(){  
    const dept_id=Number(this.cookieService.get('user_id')) 
    if(!dept_id || dept_id===0){
      console.log(console.error("invalid dept id"))
    } 
    const proj_data = {
      ...this.projectForm.value,
      dept_id
    }
    //  this.projectService.registerProject(proj_data).subscribe(()=>console.log("project inserted"))


    this.projectService.registerProject(proj_data).subscribe(()=>{
      this.projectForm.reset();
      console.log("project inserted")
    })
  }
}

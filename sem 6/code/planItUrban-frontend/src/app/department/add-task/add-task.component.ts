// MODULES //
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { DepartmentService } from 'src/app/services/department.service';
import { OfficerService } from 'src/app/services/officer.service';
import { ProjectService } from 'src/app/services/project.service';
import { TaskService } from 'src/app/services/task.service';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent implements OnInit {
  taskForm!: FormGroup;
  officers!:any
  projects!: any;
  deptId!: any;
  deptName: string = '';
  
  constructor(private fb: FormBuilder,private officerService:OfficerService,private taskService:TaskService,  private projectService: ProjectService , private cookieService: CookieService,  private departmentService: DepartmentService, ) {}

  ngOnInit(): void {

     this.deptId = this.cookieService.get('user_id');

      this.departmentService.getDepartmentById(this.deptId).subscribe((response) => {
      console.log('Department:', response);
      this.deptName = response.dept_name;  
      this.taskForm.patchValue({ dept_name: this.deptName });  
    });

    this.officerService.fetchOfficers().subscribe((value)=>{
      console.log(value)
      this.officers=value
  })

   this.projectService.fetchProjects(this.deptId).subscribe((value) => {
      console.log(value);
      this.projects = value;
    });

    this.taskForm = this.fb.group({
      task_title: ['', Validators.required],
      task_desc: ['', Validators.required],
      task_assign_to_officer: ['', Validators.required],
      task_start_date: ['', Validators.required],
      task_end_date: ['', Validators.required],
      task_status: ['', Validators.required],
      task_progress: [
        '',
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
       proj_id: ['', Validators.required],
       dept_name: ['']
    });
  }

  registerTask(){  
    console.log(this.taskForm.value)
    this.taskService.registerTask(this.taskForm.value).subscribe(()=>console.log("task inserted"))
 }
}

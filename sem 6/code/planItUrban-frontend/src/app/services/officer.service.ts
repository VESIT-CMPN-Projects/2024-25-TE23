import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfficerService {

  constructor(private httpClient:HttpClient) { }

  private apiUrl = 'http://localhost:8080/api/officers'; 

  registerOfficer(body:any){
    return this.httpClient.post("http://localhost:8080/registerOfficer",body)
  }


  fetchOfficers(){
    return this.httpClient.get("http://localhost:8080/fetchOfficers")
  }

  fetchOfficersByDept(dept_id:any){
    return this.httpClient.get(`http://localhost:8080/fetchOfficersByDept/${dept_id}`)
  }

  getTaskProgressPieChart(officerId: number): Observable<any> {
    return this.httpClient.get<any>(`http://localhost:8080/${officerId}/task-progress`);
  }

  getTaskCompletionBarChart(officerId: number): Observable<any> {
    return this.httpClient.get<any>(`http://localhost:8080/${officerId}/task-completion`);
  }

  fetchAssignedTasks(officerId:number){
    return this.httpClient.get<any>(`http://localhost:8080/assignedTasks/${officerId}`);
  }

  getOfficersByDept(deptId: number): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}?deptId=${deptId}`);
  }
}

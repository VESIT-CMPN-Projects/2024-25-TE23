import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private httpClient:HttpClient) { }


   private baseUrl = 'http://localhost:8080';

  registerTask(body:any){
    return this.httpClient.post("http://localhost:8080/registerTask",body)
  }

  fetchTasks(officer_id:number){
    return this.httpClient.get(`http://localhost:8080/fetchTasks/${officer_id}`)
  }

  fetchRecentTasks(officer_id:number){
    return this.httpClient.get(`http://localhost:8080/fetchRecentTasks/${officer_id}`)
  }

  fetchAllRecentTasks(){
    return this.httpClient.get(`http://localhost:8080/fetchAllRecentTasks`)
  }


   updateTaskProgress(taskId: number, updatedTask: any): Observable<any> {
    return this.httpClient.put(`${this.baseUrl}/update/${taskId}`, updatedTask);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private baseUrl = 'http://localhost:8080/departments';

  constructor(private http: HttpClient) {}

  getDepartmentById(deptId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${deptId}`);
  }
}

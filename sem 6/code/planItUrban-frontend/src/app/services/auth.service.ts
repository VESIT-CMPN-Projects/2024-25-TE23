// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/internal/Observable';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor(private httpClient:HttpClient) { }

//   login(body:any):Observable<any>{
//     return this.httpClient.post("http://localhost:8080/loginUser",body)
//   }

//   fetchLoggedInDepartment(dept_id:number):Observable<any>{
//     console.log(dept_id);
//     return this.httpClient.get(`http://localhost:8080/loggedInDepartment/${dept_id}`)
//   }


// }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  // Register officer (Department will receive an email)
  registerOfficer(officerData: any): Observable<any> {
    console.log(officerData);
    return this.http.post(`${this.apiUrl}/register-officer`, officerData);
  }

  // Approve officer (Triggered from department email)
  approveOfficer(officerId: number): Observable<any> {
    console.log(`Approving officer with ID: ${officerId}`);
    return this.http.post(`${this.apiUrl}/approve-officer/${officerId}`, {});
  }

  // Reject officer (Triggered from department email)
  rejectOfficer(officerId:string): Observable<any> {
    console.log(`Rejecting officer with ID: ${officerId}`);
    return this.http.get(`${this.apiUrl}/reject-officer/${officerId}`, {});
  }

  // Send password setup link (Officer receives this after approval)
  sendPasswordSetup(email: string): Observable<any> {
    console.log(`Sending password setup email to: ${email}`);
    return this.http.post(`${this.apiUrl}/send-password-setup`, { email });
  }

  // Login officer after setting password
  login(credentials: any): Observable<any> {
    console.log(`Logging in with credentials:`, credentials);
    return this.http.post(`${this.apiUrl}/loginUser`, credentials);
  }

  // Fetch details of the logged-in department
  fetchLoggedInDepartment(dept_id: number): Observable<any> {
    console.log(`Fetching logged-in department with ID: ${dept_id}`);
    return this.http.get(`${this.apiUrl}/loggedInDepartment/${dept_id}`);
  }

  fetchLoggedInOfficer(officerid: number): Observable<any> {
    console.log(`Fetching logged-in officer with ID: ${officerid}`);
    return this.http.get(`${this.apiUrl}/loggedInOfficer/${officerid}`);
  }

  fetchLoggedInCommissioner(commisioner_id: number): Observable<any> {
    console.log(`Fetching logged-in Commissioner with ID: ${commisioner_id}`);
    return this.http.get(`${this.apiUrl}/loggedInCommissioner/${commisioner_id}`);
  }
}

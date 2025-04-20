// MODULES //
import { Injectable } from '@angular/core';

// OTHERS //
import { Observable, of } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private projects = [
    {
      proj_id: 1,
      proj_title: 'Project Alpha',
      proj_location: 'Mumbai',
      proj_desc: 'A road construction project in Mumbai.',
      proj_latitude: 19.076,
      proj_longitude: 72.8777,
      proj_start_date: '2025-01-01',
      proj_end_date: '2025-06-30',
      proj_estimated_budget: 50000000,
      proj_status: 'Ongoing',
    },
    {
      proj_id: 2,
      proj_title: 'Project Beta',
      proj_location: 'Delhi',
      proj_desc: 'Metro rail extension in Delhi.',
      proj_latitude: 28.6139,
      proj_longitude: 77.209,
      proj_start_date: '2025-02-01',
      proj_end_date: '2025-12-31',
      proj_estimated_budget: 150000000,
      proj_status: 'Pending',
    },
    {
      proj_id: 3,
      proj_title: 'Project Gamma',
      proj_location: 'Pune',
      proj_desc: 'Construction of IT park in Pune.',
      proj_latitude: 18.5204,
      proj_longitude: 73.8567,
      proj_start_date: '2025-03-15',
      proj_end_date: '2025-09-15',
      proj_estimated_budget: 75000000,
      proj_status: 'Completed',
    },
  ];

  constructor(private httpClient:HttpClient) {}

  private baseUrl = 'http://localhost:8080';


  getProjects(): Observable<any[]> {
    return of(this.projects);
  }

  getProjectById(projectId: number): Observable<any> {
    const project = this.projects.find((p) => p.proj_id === projectId);
    return of(project || null);
  }

  getProjectsByStatus(status: string): Observable<any[]> {
    const filteredProjects = this.projects.filter(
      (p) => p.proj_status === status
    );
    return of(filteredProjects);
  }

  getOngoingProjects() {

    
  }

  getCompletedProjects() {
    const completedProjects = [
      {
        proj_title: 'Public Park Renovation',
        proj_desc: 'Renovated the main public park with new facilities.',
        proj_location: 'City Park',
        proj_start_date: new Date('2023-01-01'),
        proj_end_date: new Date('2023-12-31'),
        proj_status: 'Completed',
      },
    ];
    return of(completedProjects); // Return as an observable
  }

  getPendingRequestsCount() {
    const pendingRequestsCount = 5;
    return of(pendingRequestsCount);
  }

  getTotalRequestsCount() {
    const totalRequestsCount = 20;
    return of(totalRequestsCount); 
  }


  registerProject(body:any){
    return this.httpClient.post(`http://localhost:8080/registerProject/`,body);
  }



  fetchProjects(deptId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseUrl}/fetchProjects/${deptId}`);
  }

  fetchAllProjects(){
    return this.httpClient.get("http://localhost:8080/fetchProjectsWithDeptname")
  }



fetchProjectsOfOfficer(officerId: number) {
  return this.httpClient.get(`http://localhost:8080/fetchProjectsOfOfficer/${officerId}`);
}
  fetchProjectRequests(){
    return this.httpClient.get("http://localhost:8080/fetchProjectRequests")
  }


  projectApproved(project_id:any){
    return this.httpClient.get(`http://localhost:8080/projectApproved/${project_id}`)
  }


  projectRejected(project_id:any){
    return this.httpClient.get(`http://localhost:8080/projectRejected/${project_id}`)
  }


  fetchApprovedProjects(){
    return this.httpClient.get(`http://localhost:8080/fetchApprovedProjects`)
  }


  getProjectStatusCounts(): Observable<any> {
    return this.httpClient.get(`http://localhost:8080/status-counts`);
  }


  getDepartmentWiseProjects(): Observable<any> {
    return this.httpClient.get(`http://localhost:8080/department-wise`);
  }


  getLocationWiseProjects(): Observable<any> {
    return this.httpClient.get(`http://localhost:8080/location-wise`);
  }


  getBudgetSpent(): Observable<any> {
    return this.httpClient.get(`http://localhost:8080/budget-spent`);
  }


    updateProjectStatus(proj_id: number, status: string): Observable<any> {
    return this.httpClient.put<any>(`${this.baseUrl}/update-status/${proj_id}`, { status });
  }





fetchProjectsOfOfficerForMap(officerId: number) {
  return this.httpClient.get<any[]>(`http://localhost:8080/fetchProjectsOfOfficer/${officerId}`);
}

 fetchPendingRequestsCount(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/pending-requests-count`);
  }

}


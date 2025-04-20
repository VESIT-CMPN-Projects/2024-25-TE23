package com.plan_it_urban.plan_it_urban.Controller;

import com.plan_it_urban.plan_it_urban.Model.Project;
import com.plan_it_urban.plan_it_urban.Model.User;
import com.plan_it_urban.plan_it_urban.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
public class ProjectController {
    @Autowired
    ProjectService projectService;

    @Autowired
    JdbcTemplate jdbcTemplate;

    @PostMapping("/registerProject/")
    @CrossOrigin(origins = "http://localhost:4200")
    public void registerProject(@RequestBody Project project){
//        System.out.println("user(department): "+user);
        projectService.registerProject(project);
    }



    @GetMapping("/fetchProjects/{dept_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> fetchProjects(@PathVariable("dept_id") int dept_id){
        return projectService.fetchProjects(dept_id);
    }

    @GetMapping("/fetchProjectsWithDeptname")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> fetchProjectsWithDeptname(){
        return projectService.fetchProjectsWithDeptname();
    }

//    @GetMapping("/fetchProjectsOfOfficer")
//    @CrossOrigin(origins = "http://localhost:4200")
//    public List<Map<String, Object>> fetchProjectsOfOfficer(){
//        return projectService.fetchProjectsOfOfficer();
//    }



    @GetMapping("/fetchProjectsOfOfficer/{officerId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> fetchProjectsOfOfficer(@PathVariable("officerId") Long officerId) {
        return projectService.fetchProjectsOfOfficer(officerId);
    }



    @GetMapping("/fetchProjectsOfOfficerForMap/{officerId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> fetchProjectsOfOfficerForMap(@PathVariable("officerId") Long officerId) {
        return projectService.fetchProjectsOfOfficerForMap(officerId);
    }



    @GetMapping("/fetchProjectRequests")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> fetchProjectRequests(){
        return projectService.fetchProjectRequests();
    }

    @GetMapping("/projectApproved/{project_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public void projectApproved(@PathVariable("project_id") int project_id){
         projectService.projectApproved(project_id);
    }

    @GetMapping("/projectRejected/{project_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public void projectRejected(@PathVariable("project_id") int project_id){
        projectService.projectRejected(project_id);
    }

    @GetMapping("/fetchApprovedProjects")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String,Object>> fetchApprovedProjects(){
        return projectService.fetchApprovedProjects();
    }

    @GetMapping("/status-counts")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Integer>> getProjectStatusCounts() {
        return ResponseEntity.ok(projectService.getProjectStatusCounts());
    }

    @GetMapping("/department-wise")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<List<Map<String, Object>>> getDepartmentWiseProjects() {
        return ResponseEntity.ok(projectService.getDepartmentWiseProjects());
    }

    @GetMapping("/location-wise")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<List<Map<String, Object>>> getLocationWiseProjects() {
        return ResponseEntity.ok(projectService.getLocationWiseProjects());
    }

    @GetMapping("/budget-spent")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<List<Map<String, Object>>> getBudgetSpent() {
        return ResponseEntity.ok(projectService.getBudgetSpent());
    }

    @GetMapping("/approved")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<List<Map<String, Object>>> getApprovedProjects() {
        return ResponseEntity.ok(projectService.getApprovedProjects());
    }


    @PutMapping("/update-status/{proj_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<String> updateProjectStatus(
            @PathVariable("proj_id") int proj_id,
            @RequestBody Map<String, String> body) {

        String newStatus = body.get("status");
        projectService.updateProjectStatus(proj_id, newStatus);
        return ResponseEntity.ok("Project status updated successfully.");
    }



    @GetMapping("/getProjectsByDepartment")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> getProjectsByDepartment(@RequestParam("dept_id") int deptId) {
        String sql = "SELECT proj_id, proj_title, proj_location, proj_latitude, proj_longitude, proj_desc " +
                "FROM project " +
                "WHERE dept_id = ?";

        return jdbcTemplate.queryForList(sql, deptId);
    }



    @GetMapping("/pending-requests-count")
    @CrossOrigin(origins = "http://localhost:4200")
    public Map<String, Integer> getPendingRequestsCount() {
        int count = projectService.getPendingRequestsCount();
        return Map.of("pendingRequests", count);
    }





}

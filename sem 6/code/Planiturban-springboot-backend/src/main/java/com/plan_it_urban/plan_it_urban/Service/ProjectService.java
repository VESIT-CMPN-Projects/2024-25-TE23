package com.plan_it_urban.plan_it_urban.Service;

import com.plan_it_urban.plan_it_urban.Model.Project;
import com.plan_it_urban.plan_it_urban.Model.User;
import com.plan_it_urban.plan_it_urban.Repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProjectService {
    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;

    public void registerProject(Project project){
//        Integer user_id = user.getUserId();
//        System.out.println("userid loggedin is: "+user_id);
//        project.setDept_id(user_id);
        System.out.println(project);
        projectRepository.registerProject(project);
    }

    public List<Map<String, Object>> fetchProjects(int dept_id){
        return projectRepository.fetchProjects(dept_id);
    }

    public List<Map<String, Object>> fetchProjectsWithDeptname(){
        return projectRepository.fetchProjectsWithDeptname();
    }

//    public List<Map<String, Object>> fetchProjectsOfOfficer(){
//        System.out.println(projectRepository.fetchProjectsOfOfficer());
//        return projectRepository.fetchProjectsOfOfficer();
//
//    }


    public List<Map<String, Object>> fetchProjectsOfOfficer(Long officerId) {
        System.out.println("Fetching projects for officer ID: " + officerId);
        return projectRepository.fetchProjectsOfOfficer(officerId);
    }


    public List<Map<String, Object>> fetchProjectsOfOfficerForMap(Long officerId) {
        System.out.println("Fetching projects for officer ID: " + officerId);
        return projectRepository.fetchProjectsOfOfficerForMap(officerId);
    }

    public List<Map<String, Object>> fetchProjectRequests(){
//        System.out.println(projectRepository.fetchProjectsOfOfficer());
        return projectRepository.fetchProjectRequests();

    }

    public void projectApproved(int project_id){
         projectRepository.projectApproved(project_id);

    }

    public void projectRejected(int project_id){
        projectRepository.projectRejected(project_id);

    }

    public List<Map<String,Object>> fetchApprovedProjects(){
        System.out.println(projectRepository.fetchApprovedProjects());
        return projectRepository.fetchApprovedProjects();

    }


    public Map<String, Integer> getProjectStatusCounts() {
        Map<String, Integer> counts = new HashMap<>();
        counts.put("Pending", projectRepository.countByStatus("Pending"));
        counts.put("In Progress", projectRepository.countByStatus("In Progress"));
        counts.put("Completed", projectRepository.countByStatus("Completed"));
        return counts;
    }

    public List<Map<String, Object>> getDepartmentWiseProjects() {
        return projectRepository.getDepartmentWiseProjects();
    }

    public List<Map<String, Object>> getLocationWiseProjects() {
        return projectRepository.getLocationWiseProjects();
    }

    public List<Map<String, Object>> getBudgetSpent() {
        return projectRepository.getBudgetSpent();
    }

    public List<Map<String, Object>> getApprovedProjects() {
        return projectRepository.getApprovedProjects();
    }


    public void updateProjectStatus(int proj_id, String newStatus){
        projectRepository.updateProjectStatus(proj_id, newStatus);
    }


    public int getPendingRequestsCount() {
        String sql = "SELECT COUNT(*) FROM project WHERE isApproved = 0";
        return jdbcTemplate.queryForObject(sql, Integer.class);
    }

}

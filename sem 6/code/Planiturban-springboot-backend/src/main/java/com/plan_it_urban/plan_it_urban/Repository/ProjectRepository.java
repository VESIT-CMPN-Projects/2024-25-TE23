package com.plan_it_urban.plan_it_urban.Repository;

import com.plan_it_urban.plan_it_urban.Model.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Repository
public class ProjectRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public void registerProject(Project project) {
        jdbcTemplate.update("CALL sp_register_project (?,?,?,?,?,?,?,?,?,?)",
                project.getProj_title(),
                project.getProj_desc(),
                project.getProj_location(),
                project.getProj_latitude(),
                project.getProj_longitude(),
                project.getProj_start_date(),
                project.getProj_end_date(),
                project.getProj_estimated_budget(),
                project.getProj_status(),
                project.getDept_id()
        );
        System.out.println("project inserted");
    }

    public List<Map<String,Object>> fetchProjects(int dept_id){
        return jdbcTemplate.queryForList("Select * from project where dept_id = ? and isApproved = 1", dept_id);
    }

    public List<Map<String,Object>> fetchProjectsWithDeptname(){
        return jdbcTemplate.queryForList("SELECT \n" +
                "    p.*, d.dept_name\n" +
                "FROM \n" +
                "    project p\n" +
                "JOIN \n" +
                "    department d ON p.dept_id = d.dept_id;");

    }


    public List<Map<String, Object>> fetchProjectsByOfficerDept(int officerId, String deptName) {
        String sql = """
        SELECT p.*, d.dept_name
        FROM project p
        JOIN department d ON p.dept_id = d.dept_id
        JOIN officer o ON o.officer_dept = d.dept_id
        WHERE o.officer_id = ? AND d.dept_name = ?
    """;
        return jdbcTemplate.queryForList(sql, officerId, deptName);
    }



    public List<Map<String, Object>> fetchProjectsOfOfficer(Long officerId) {
        String sql = "SELECT p.* " +
                "FROM project p " +
                "JOIN department d ON p.dept_id = d.dept_id " +
                "JOIN officer o ON o.officer_dept = d.dept_id " +         // Match with ID
                "   OR o.officer_dept = d.dept_name " +                   // Match with Name
                "WHERE o.officer_id = ?";
        return jdbcTemplate.queryForList(sql, officerId);
    }

    public List<Map<String, Object>> fetchProjectsOfOfficerForMap(Long officerId) {
        String sql = "SELECT p.* " +
                "FROM project p " +
                "JOIN department d ON p.dept_id = d.dept_id " +
                "JOIN officer o ON o.officer_dept = d.dept_id " +         // Match with ID
                "   OR o.officer_dept = d.dept_name " +                   // Match with Name
                "WHERE o.officer_id = ?";
        return jdbcTemplate.queryForList(sql, officerId);
    }




    public List<Map<String, Object>> fetchProjectRequests(){
        return jdbcTemplate.queryForList("SELECT \n" +
                "    p.*, \n" +
                "    d.dept_name\n" +
                "FROM \n" +
                "    project p\n" +
                "JOIN \n" +
                "    department d \n" +
                "ON \n" +
                "    p.dept_id = d.dept_id;\n");
    }

    public void projectApproved(int project_id){
         jdbcTemplate.update("UPDATE project \n" +
                 "SET isApproved = TRUE \n" +
                 "WHERE proj_id = ?;\n",project_id);
    }

    public void projectRejected(int project_id){
        jdbcTemplate.update("UPDATE project \n" +
                "SET isApproved = FALSE \n" +
                "WHERE proj_id = ?;\n",project_id);
    }

//    public List<Map<String, Object>> fetchApprovedProjects() {
//        return jdbcTemplate.queryForList(
//                "SELECT *, CURRENT_TIME AS curr_time FROM project WHERE isApproved = 1 ORDER BY curr_time DESC"
//        );
//    }


    public List<Map<String, Object>> fetchApprovedProjects() {
        String sql = """
        SELECT 
            p.proj_id, 
            d.dept_name,                -- Fetching department name
            p.proj_title, 
            p.proj_location, 
            p.proj_desc, 
            p.proj_latitude, 
            p.proj_longitude, 
            p.proj_start_date, 
            p.proj_end_date, 
            p.proj_estimated_budget, 
            p.proj_status
        FROM project p
        JOIN department d ON p.dept_id = d.dept_id   -- Joining with department table
        WHERE p.isApproved = 1
        ORDER BY p.proj_start_date DESC;
    """;

        return jdbcTemplate.queryForList(sql);
    }



    // Get count of projects by status
    public int countByStatus(String status) {
        String sql = "SELECT COUNT(*) FROM project WHERE proj_status = ? and isApproved = 1";
        return jdbcTemplate.queryForObject(sql, Integer.class, status);
    }

    // Get project count grouped by department
    public List<Map<String, Object>> getDepartmentWiseProjects() {
        String sql = "SELECT dept_id, COUNT(*) AS count FROM project GROUP BY dept_id";
        return jdbcTemplate.queryForList(sql);
    }

    // Get project count grouped by location
    public List<Map<String, Object>> getLocationWiseProjects() {
        String sql = "SELECT proj_location, COUNT(*) AS count FROM project GROUP BY proj_location";
        return jdbcTemplate.queryForList(sql);
    }

    // Get project budget spent
    public List<Map<String, Object>> getBudgetSpent() {
        String sql = "SELECT proj_title AS project, proj_estimated_budget AS budget FROM project where isApproved = 1";
        return jdbcTemplate.queryForList(sql);
    }

    // Get approved projects
    public List<Map<String, Object>> getApprovedProjects() {
        String sql = "SELECT * FROM project WHERE isApproved = 1";
        return jdbcTemplate.queryForList(sql);
    }


    public void updateProjectStatus(int proj_id, String status) {
        String sql = "UPDATE project SET proj_status = ? WHERE proj_id = ?";
        jdbcTemplate.update(sql, status, proj_id);
    }

}

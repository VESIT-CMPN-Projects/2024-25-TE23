package com.plan_it_urban.plan_it_urban.Repository;

import com.plan_it_urban.plan_it_urban.Model.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class ProjectDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Project> findProjectsByDepartment(String departmentName) {
        String sql = "SELECT proj_id, proj_title, proj_desc, proj_location, proj_latitude, proj_longitude, proj_start_date, proj_end_date, proj_estimated_budget, proj_status FROM Project WHERE dept_id = (SELECT dept_id FROM Department WHERE dept_name = ?)";

        return jdbcTemplate.query(sql, new Object[]{departmentName}, (rs, rowNum) -> {
            return new Project(
                    rs.getInt("proj_id"),
                    0, // Skipping dept_id
                    rs.getString("proj_title"),
                    rs.getString("proj_desc"),
                    rs.getString("proj_location"),
                    rs.getDouble("proj_latitude"),
                    rs.getDouble("proj_longitude"),
                    rs.getDate("proj_start_date"),
                    rs.getDate("proj_end_date"),
                    rs.getDouble("proj_estimated_budget"),
                    rs.getString("proj_status")
            );
        });
    }

    public Project findProjectByName(String departmentName, String projectName) {
        String sql = "SELECT proj_id, proj_title, proj_desc, proj_location, proj_latitude, proj_longitude, proj_start_date, proj_end_date, proj_estimated_budget, proj_status FROM Project WHERE proj_title = ? AND dept_id = (SELECT dept_id FROM Department WHERE dept_name = ?)";

        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{projectName, departmentName}, (rs, rowNum) -> {
                return new Project(
                        rs.getInt("proj_id"),
                        0, // Skipping dept_id
                        rs.getString("proj_title"),
                        rs.getString("proj_desc"),
                        rs.getString("proj_location"),
                        rs.getDouble("proj_latitude"),
                        rs.getDouble("proj_longitude"),
                        rs.getDate("proj_start_date"),
                        rs.getDate("proj_end_date"),
                        rs.getDouble("proj_estimated_budget"),
                        rs.getString("proj_status")
                );
            });
        } catch (Exception e) {
            return null;
        }
    }



    public List<Project> findProjectsByDepartmentId(String deptId) {
        String sql = "SELECT * FROM Project WHERE dept_id = ?";
        return jdbcTemplate.query(sql, new Object[]{deptId}, (rs, rowNum) -> new Project(
                rs.getInt("proj_id"),
                rs.getInt("dept_id"),
                rs.getString("proj_title"),
                rs.getString("proj_desc"),
                rs.getString("proj_location"),
                rs.getDouble("proj_latitude"),
                rs.getDouble("proj_longitude"),
                rs.getDate("proj_start_date"),
                rs.getDate("proj_end_date"),
                rs.getDouble("proj_estimated_budget"),
                rs.getString("proj_status")
        ));
    }



    //latest
    public List<Project> findProjectsByDepartmentAndStatus(String departmentName, String status) {
        String sql = "SELECT proj_id, proj_title, proj_desc, proj_location, proj_latitude, proj_longitude, proj_start_date, proj_end_date, proj_estimated_budget, proj_status FROM Project WHERE dept_id = (SELECT dept_id FROM Department WHERE dept_name = ?) AND proj_status = ?";

        return jdbcTemplate.query(sql, new Object[]{departmentName, status}, (rs, rowNum) -> {
            return new Project(
                    rs.getInt("proj_id"),
                    0, // Skipping dept_id
                    rs.getString("proj_title"),
                    rs.getString("proj_desc"),
                    rs.getString("proj_location"),
                    rs.getDouble("proj_latitude"),
                    rs.getDouble("proj_longitude"),
                    rs.getDate("proj_start_date"),
                    rs.getDate("proj_end_date"),
                    rs.getDouble("proj_estimated_budget"),
                    rs.getString("proj_status")
            );
        });
    }


    public List<Project> findProjectsByDepartmentAndBudgetGreaterThan(String departmentName, double budget) {
        String sql = "SELECT proj_id, proj_title, proj_desc, proj_location, proj_latitude, proj_longitude, proj_start_date, proj_end_date, proj_estimated_budget, proj_status FROM Project WHERE dept_id = (SELECT dept_id FROM Department WHERE dept_name = ?) AND proj_estimated_budget > ?";

        return jdbcTemplate.query(sql, new Object[]{departmentName, budget}, (rs, rowNum) -> {
            return new Project(
                    rs.getInt("proj_id"),
                    0, // Skipping dept_id
                    rs.getString("proj_title"),
                    rs.getString("proj_desc"),
                    rs.getString("proj_location"),
                    rs.getDouble("proj_latitude"),
                    rs.getDouble("proj_longitude"),
                    rs.getDate("proj_start_date"),
                    rs.getDate("proj_end_date"),
                    rs.getDouble("proj_estimated_budget"),
                    rs.getString("proj_status")
            );
        });
    }


    public long countProjectsByDepartment(String departmentName) {
        String sql = "SELECT COUNT(*) FROM Project WHERE dept_id = (SELECT dept_id FROM Department WHERE dept_name = ?)";
        return jdbcTemplate.queryForObject(sql, new Object[]{departmentName}, Long.class);
    }


    public long countProjectsByDepartmentAndStatus(String departmentName, String status) {
        String sql = "SELECT COUNT(*) FROM Project WHERE dept_id = (SELECT dept_id FROM Department WHERE dept_name = ?) AND proj_status = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{departmentName, status}, Long.class);
    }

    public long countHighBudgetProjectsByDepartment(String departmentName, double budget) {
        String sql = "SELECT COUNT(*) FROM Project WHERE dept_id = (SELECT dept_id FROM Department WHERE dept_name = ?) AND proj_estimated_budget > ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{departmentName, budget}, Long.class);
    }



}













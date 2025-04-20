package com.plan_it_urban.plan_it_urban.Repository;

import com.plan_it_urban.plan_it_urban.Model.Department;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class DepartmentRepository {

    private final JdbcTemplate jdbcTemplate;

    public DepartmentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Department findById(int deptId) {
        String sql = "SELECT * FROM department WHERE dept_id = ?";
        return jdbcTemplate.queryForObject(sql, departmentRowMapper, deptId);
    }

    private final RowMapper<Department> departmentRowMapper = (rs, rowNum) -> {
        Department department = new Department();
        department.setDept_id(rs.getInt("dept_id"));
        department.setDept_name(rs.getString("dept_name"));
        department.setDept_code(rs.getString("dept_code"));
        department.setDept_state(rs.getString("dept_state"));
        department.setDept_city(rs.getString("dept_city"));
        return department;
    };
}

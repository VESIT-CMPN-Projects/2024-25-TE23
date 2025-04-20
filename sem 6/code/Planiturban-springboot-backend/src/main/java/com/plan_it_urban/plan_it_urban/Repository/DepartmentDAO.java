package com.plan_it_urban.plan_it_urban.Repository;

import com.plan_it_urban.plan_it_urban.Model.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class DepartmentDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Department findByCode(String deptCode) {

        String sql = "SELECT * FROM Department WHERE dept_code LIKE ?";

        System.out.println("Executing SQL: " + sql + " with deptCode = " + deptCode);

        try {
            return jdbcTemplate.queryForObject(sql, new Object[]{"%" + deptCode}, (rs, rowNum) -> {
                Department department = new Department();
                department.setDept_id(rs.getInt("dept_id"));
                department.setDept_name(rs.getString("dept_name"));
                department.setDept_code(rs.getString("dept_code"));
                return department;
            });
        } catch (EmptyResultDataAccessException e) {
            System.out.println("No department found for code: " + deptCode);
            return null;
        }
    }




}


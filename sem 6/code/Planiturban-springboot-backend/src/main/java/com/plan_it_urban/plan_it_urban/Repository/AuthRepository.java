package com.plan_it_urban.plan_it_urban.Repository;

import com.plan_it_urban.plan_it_urban.Model.Officer;
import com.plan_it_urban.plan_it_urban.Model.Project;
import com.plan_it_urban.plan_it_urban.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;

@Repository
public class AuthRepository  {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public Map<String, Object> login(String username, String password, String role) {
        System.out.println("Repo  recived in Service "+username);

        String sql = "CALL sp_login(?, ?, ?)";
        try {
            System.out.println("password" +password);
            return jdbcTemplate.queryForMap(sql, username, password, role);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("validYN", 0);
            response.put("message", "Invalid login credentials or role.");

            return response;
        }
    }

    public Map<String,Object> fetchLoggedInDepartment(int dept_id){
//        Integer user_id = user.getUserId();
//        System.out.println("userid loggedin is: "+user_id);
        Project project = new Project();
        project.setDept_id(dept_id);
        return jdbcTemplate.queryForMap("Select * from department where dept_id = ?",dept_id);
    }

    public Map<String,Object> fetchLoggedInOfficer(int officer_id){
        return jdbcTemplate.queryForMap("Select * from officer where officer_id = ?",officer_id);
    }

    public Map<String,Object> fetchLoggedInCommissioner(int commissioner_id){
        return jdbcTemplate.queryForMap("Select * from commissioner where c_id = ?",commissioner_id);
    }

    public void rejectionEmailDeleteUser(String email){
        jdbcTemplate.update("Delete from officer where officer_email = ?",email);
    }

    public void updatePassword(String email, String password){

        jdbcTemplate.update("Update officer Set password = ? WHERE officer_email = ?",password, email);
    }
}

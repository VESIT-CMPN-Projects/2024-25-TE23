package com.plan_it_urban.plan_it_urban.Service;

import com.plan_it_urban.plan_it_urban.Model.Officer;
import com.plan_it_urban.plan_it_urban.Repository.OfficerRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class OfficerService {
    @Autowired
    OfficerRepository officerRepository;

    @Autowired
    JdbcTemplate jdbcTemplate;



    public void registerOfficer(Officer officer){
        officerRepository.registerOfficer(officer);
    }



    public List<Map<String, Object>> fetchOfficers(){
        return officerRepository.fetchOfficers();
    }

    public List<Map<String, Object>> fetchOfficersByDept(int dept_id){
        return officerRepository.fetchOfficersByDept(dept_id);
    }

    public Map<String, Integer> getTaskProgressPieChart(Long officerId) {
        int[] taskData = officerRepository.getTaskProgress(officerId);
        return Map.of(
                "Completed", taskData[0],
                "In Progress", taskData[1],
                "Pending", taskData[2]
        );
    }

    public List<Map<String, Object>> fetchAssignedTasks(int officer_id){
        return officerRepository.fetchAssignedTasks(officer_id);
    }

    public Map<String, Integer> getTaskCompletionBarChart(Long officerId) {
        int[] taskData = officerRepository.getTaskProgress(officerId);
        return Map.of(
                "Completed", taskData[0],
                "In Progress", taskData[1],
                "Pending", taskData[2]
        );
    }


    public List<Map<String, Object>> getAllOfficersByDept(int deptId) {
        String sql = """
        SELECT 
            o.officer_id, 
            d.dept_id,
            o.officer_name, 
            p.proj_title, 
            t.task_title, 
            CAST(t.task_progress AS UNSIGNED) AS task_progress -- Display as number
        FROM officer o
        LEFT JOIN task t ON o.officer_dept = t.dept_name -- Join by dept_name in task
        LEFT JOIN project p ON t.proj_id = p.proj_id
        LEFT JOIN department d 
        ON CAST(d.dept_id AS CHAR) = CAST(o.officer_dept AS CHAR)
        OR CAST(d.dept_name AS CHAR) = CAST(o.officer_dept AS CHAR)
        WHERE d.dept_id = ? -- Only show officers from the logged-in department
    """;

        return jdbcTemplate.queryForList(sql, deptId);
    }

}

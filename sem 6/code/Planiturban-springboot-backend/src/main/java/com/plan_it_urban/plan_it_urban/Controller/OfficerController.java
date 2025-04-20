package com.plan_it_urban.plan_it_urban.Controller;

import com.plan_it_urban.plan_it_urban.Model.Officer;
import com.plan_it_urban.plan_it_urban.Service.OfficerService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class OfficerController {
    @Autowired
    OfficerService officerService;



    @PostMapping("/registerOfficer")
    @CrossOrigin(origins = "http://localhost:4200")
    public void registerOfficer(@RequestBody Officer officer){
        System.out.println("Received Officer Data: " + officer);
        officerService.registerOfficer(officer);
    }







    @GetMapping("/fetchOfficers")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> fetchOfficers(){
        return officerService.fetchOfficers();
    }

    @GetMapping("/fetchOfficersByDept/{dept_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> fetchOfficersByDept(@PathVariable("dept_id") int dept_id){
        return officerService.fetchOfficersByDept(dept_id);
    }

    @GetMapping("/{id}/task-progress")
    @CrossOrigin(origins = "http://localhost:4200")
    public Map<String, Integer> getTaskProgressPieChart(@PathVariable("id") Long id) {
        return officerService.getTaskProgressPieChart(id);
    }

    @GetMapping("/{id}/task-completion")
    @CrossOrigin(origins = "http://localhost:4200")
    public Map<String, Integer> getTaskCompletionBarChart(@PathVariable("id") Long id) {
        return officerService.getTaskCompletionBarChart(id);
    }

    @GetMapping("/assignedTasks/{officer_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> fetchAssignedTasks(@PathVariable("officer_id") int officer_id){
        return officerService.fetchAssignedTasks(officer_id);
    }


    @GetMapping("/api/officers")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> getAllOfficersByDept(@RequestParam("deptId") int deptId) {
        return officerService.getAllOfficersByDept(deptId);
    }
}

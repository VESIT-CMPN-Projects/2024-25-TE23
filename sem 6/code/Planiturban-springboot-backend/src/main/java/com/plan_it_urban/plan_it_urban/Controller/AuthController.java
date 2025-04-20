package com.plan_it_urban.plan_it_urban.Controller;

import com.plan_it_urban.plan_it_urban.Model.Officer;
import com.plan_it_urban.plan_it_urban.Model.User;
import com.plan_it_urban.plan_it_urban.Repository.OfficerRepository;
import com.plan_it_urban.plan_it_urban.Service.AuthService;
import com.plan_it_urban.plan_it_urban.Service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {
    @Autowired
    AuthService authService;


    @GetMapping("/loggedInDepartment/{dept_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public Map<String,Object> fetchLoggedInDepartment(@PathVariable("dept_id") int dept_id){
        System.out.println(dept_id);
        return authService.fetchLoggedInDepartment(dept_id);
    }

    @GetMapping("/loggedInOfficer/{officer_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public Map<String,Object> fetchLoggedInOfficer(@PathVariable("officer_id") int officer_id){
        System.out.println(officer_id);
        return authService.fetchLoggedInOfficer(officer_id);
    }

    @GetMapping("/loggedInCommissioner/{commissioner_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public Map<String,Object> fetchLoggedInCommissioner(@PathVariable("commissioner_id") int commissioner_id){
        System.out.println(commissioner_id);
        return authService.fetchLoggedInCommissioner(commissioner_id);
    }

    // User login (for department & commissioner)
    @PostMapping("/loginUser")
    @CrossOrigin(origins = "http://localhost:4200")
    public Map<String, Object> login(@RequestBody User user) {
        return authService.login(user.getUsername(), user.getPassword(), user.getRole());
    }

    // Officer registration
    @PostMapping("/register-officer")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<?> registerOfficer(@RequestBody Officer officer) {
        System.out.println("Received Officer: " + officer);
        return authService.registerOfficer(officer);
    }

    // Approve officer
    @GetMapping("/approve-officer/{email}")
    public ResponseEntity<?> approveOfficer(@PathVariable("email") String email) {
        return authService.approveOfficer(email);
    }

    // Reject officer
    @GetMapping("/reject-officer/{emailId}")
//    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<?> rejectOfficer(@PathVariable("emailId") String emailId) {
        System.out.println(emailId);
        return authService.rejectOfficer(emailId);
    }

    // Send password setup link after approval
    @PostMapping("/send-password-setup")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<?> sendPasswordSetup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        return authService.sendPasswordSetup(email);
    }



}

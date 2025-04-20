package com.plan_it_urban.plan_it_urban.Controller;
import com.plan_it_urban.plan_it_urban.Model.Department;
import com.plan_it_urban.plan_it_urban.Model.Project;
import com.plan_it_urban.plan_it_urban.Service.ChatbotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/chatbot")
public class ChatbotController {

    @Autowired
    private ChatbotService chatbotService;



    @PostMapping("/start-conversation")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> startConversation(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");

        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of("valid", false, "message", "Hello! Please provide your Department Code to continue."));
        }
        return ResponseEntity.ok(Map.of("valid", false, "message", "Please provide your Department Code to continue."));
    }


    @PostMapping("/verify-code")
    public ResponseEntity<Map<String, Object>> verifyCode(@RequestBody Map<String, String> payload) {
        String code = payload.get("deptCode");

        System.out.println("Received department code: " + code);

        if (code == null || code.isEmpty()) {
            System.out.println("Department code is empty.");
            return ResponseEntity.ok(Map.of("valid", false, "message", "Please provide your Department Code to proceed."));
        }

        String departmentResponse = chatbotService.identifyDepartment(code);
        System.out.println("Department Response: " + departmentResponse);

        if (departmentResponse.startsWith("Sorry")) {
            System.out.println("Invalid department code.");
            return ResponseEntity.ok(Map.of("valid", false, "message", "Invalid Department Code. Please enter the correct code or ask general questions."));
        }

        String departmentName = departmentResponse.replace("Welcome! You are identified as ", "")
                .replace(" Department. How may I assist you today?", "");

        System.out.println("Verified Department: " + departmentName);

        return ResponseEntity.ok(Map.of("valid", true, "departmentName", departmentName, "message", departmentResponse));
    }



    @PostMapping("/chat")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, String> payload) {
        String message = payload.get("message");
        String deptCode = payload.get("dept_code");

        if (deptCode == null || deptCode.isEmpty()) {
            return ResponseEntity.ok(Map.of("valid", false, "message", "Please provide your Department Code to proceed."));
        }

        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of("valid", false, "message", "Please provide a valid message to proceed."));
        }

        // Fetch department name from deptCode
        Department department = chatbotService.departmentDAO.findByCode(deptCode);
        if (department == null) {
            return ResponseEntity.ok(Map.of("valid", false, "message", "Invalid Department Code."));
        }
        String departmentName = department.getDept_name();

        // Fetch AI response using department name
        String aiResponse = chatbotService.getPreTrainedResponse(message, deptCode);

        return ResponseEntity.ok(Map.of("valid", true, "departmentName", departmentName, "aiResponse", aiResponse));
    }




    @PostMapping("/get-project-status")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> getProjectStatus(@RequestBody Map<String, String> payload) {
        String departmentName = payload.get("department");
        String projectName = payload.get("projectName");

        if (departmentName == null || departmentName.isEmpty()) {
            return ResponseEntity.ok(Map.of("valid", false, "message", "Invalid department."));
        }

        if (projectName != null && !projectName.isEmpty()) {
            Project project = chatbotService.getProjectByName(departmentName, projectName);
            if (project == null) {
                return ResponseEntity.ok(Map.of("valid", true, "message", "No project found with name: " + projectName + " in " + departmentName + " department."));
            }
            return ResponseEntity.ok(Map.of("valid", true, "project", project));
        }

        List<Project> projects = chatbotService.getProjectsByDepartment(departmentName);
        if (projects.isEmpty()) {
            return ResponseEntity.ok(Map.of("valid", true, "message", "No projects found for " + departmentName + " department."));
        }

        return ResponseEntity.ok(Map.of("valid", true, "projects", projects));
    }



    @GetMapping("/generate/{deptId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<?> generateReport(@PathVariable String deptId) {
        List<Project> projects = chatbotService.getProjectsByDepartmentId(deptId);

        if (projects.isEmpty()) {
            return ResponseEntity.badRequest().body("No projects found for this department.");
        }


        return ResponseEntity.ok("PDF Report Generated");
    }






    @GetMapping("/count-projects/{deptId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> countProjects(@PathVariable("deptId") String deptId) {
        long projectCount = chatbotService.getProjectCountByDepartment(deptId);

        return ResponseEntity.ok(Map.of("valid", true, "departmentId", deptId, "projectCount", projectCount));
    }

    @GetMapping("/get-pending-projects/{deptId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> getPendingProjects(@PathVariable("deptId") String deptId) {
        List<Project> pendingProjects = chatbotService.getPendingProjectsByDepartment(deptId);

        if (pendingProjects.isEmpty()) {
            return ResponseEntity.ok(Map.of("valid", true, "message", "No pending projects for this department."));
        }

        return ResponseEntity.ok(Map.of("valid", true, "pendingProjects", pendingProjects));
    }

    @GetMapping("/get-ongoing-projects/{deptId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> getOngoingProjects(@PathVariable("deptId") String deptId) {
        List<Project> ongoingProjects = chatbotService.getOngoingProjectsByDepartment(deptId);

        if (ongoingProjects.isEmpty()) {
            return ResponseEntity.ok(Map.of("valid", true, "message", "No ongoing projects for this department."));
        }

        return ResponseEntity.ok(Map.of("valid", true, "ongoingProjects", ongoingProjects));
    }

    @GetMapping("/get-high-budget-projects/{deptId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> getHighBudgetProjects(@PathVariable("deptId") String deptId) {
        double budgetThreshold = 10000000; // Set a default budget threshold

        List<Project> highBudgetProjects = chatbotService.getHighBudgetProjectsByDepartment(deptId, budgetThreshold);

        if (highBudgetProjects.isEmpty()) {
            return ResponseEntity.ok(Map.of("valid", true, "message", "No high-budget projects for this department."));
        }

        return ResponseEntity.ok(Map.of("valid", true, "highBudgetProjects", highBudgetProjects));
    }


    @GetMapping("/count-pending-projects/{deptId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> countPendingProjects(@PathVariable("deptId") String deptId) {
        long pendingProjectCount = chatbotService.getProjectCountByDepartmentAndStatus(deptId, "pending");

        return ResponseEntity.ok(Map.of("valid", true, "departmentId", deptId, "pendingProjectCount", pendingProjectCount));
    }

    @GetMapping("/count-ongoing-projects/{deptId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> countOngoingProjects(@PathVariable("deptId") String deptId) {
        long ongoingProjectCount = chatbotService.getProjectCountByDepartmentAndStatus(deptId, "In-Progress");

        return ResponseEntity.ok(Map.of("valid", true, "departmentId", deptId, "ongoingProjectCount", ongoingProjectCount));
    }

    @GetMapping("/count-high-budget-projects/{deptId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> countHighBudgetProjects(@PathVariable("deptId") String deptId) {
        double budgetThreshold = 10000000; // Default high budget threshold
        long highBudgetProjectCount = chatbotService.getHighBudgetProjectCountByDepartment(deptId, budgetThreshold);

        return ResponseEntity.ok(Map.of("valid", true, "departmentId", deptId, "highBudgetProjectCount", highBudgetProjectCount));
    }

}

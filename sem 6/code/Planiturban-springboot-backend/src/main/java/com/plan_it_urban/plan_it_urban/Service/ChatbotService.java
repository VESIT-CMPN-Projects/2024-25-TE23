package com.plan_it_urban.plan_it_urban.Service;
import com.plan_it_urban.plan_it_urban.Model.Department;
import com.plan_it_urban.plan_it_urban.Model.Project;
import com.plan_it_urban.plan_it_urban.Repository.DepartmentDAO;
import com.plan_it_urban.plan_it_urban.Repository.ProjectDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class ChatbotService {

    @Autowired
    public DepartmentDAO departmentDAO;

    @Autowired
    private ProjectDAO projectDAO;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=AIzaSyAUUosEUHY49ehxJce4de7AHefkjnzESLk";



    public String getPreTrainedResponse(String userMessage, String deptCode) {
        if (userMessage == null || userMessage.trim().isEmpty()) {
            return "Error: Message cannot be empty.";
        }

        Department department = departmentDAO.findByCode(deptCode);
        if (department == null) {
            return "Error: Invalid department code.";
        }
        String departmentName = department.getDept_name();

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();

        String departmentContext = "You are an AI assistant for the ${safeDepartmentName} department. "
                + "If the user asks about projects, respond with EXACTLY this text: 'FETCH_PROJECTS'. DO NOT add any extra words. "
                + "If the user asks about in general project count without pending, ongoing respond with EXACTLY this text: 'COUNT_PROJECTS'. "
                + "If the user asks about pending projects, respond with EXACTLY this text: 'PENDING_PROJECTS'. "
                + "If the user asks about ongoing projects, respond with EXACTLY this text: 'ONGOING_PROJECTS'. "
                + "If the user asks about high-budget projects, respond with EXACTLY this text: 'HIGH_BUDGET_PROJECTS'. "
                + "If the user asks about the count of pending projects, respond with EXACTLY this text: 'PENDING_PROJECTS_COUNT'. "
                + "If the user asks about the count of ongoing projects, respond with EXACTLY this text: 'ONGOING_PROJECTS_COUNT'. "
                + "If the user asks about the count of high-budget projects, respond with EXACTLY this text: 'HIGH_BUDGET_PROJECTS_COUNT'. "
                + "If the user's question is related to ${safeDepartmentName}, provide a detailed response based strictly on the department's work and responsibilities.";

        Map<String, Object> userMessagePart = new HashMap<>();
        userMessagePart.put("role", "user");
        userMessagePart.put("parts", List.of(Map.of("text", departmentContext + "\n\nUser: " + userMessage)));

        contents.add(userMessagePart);

        requestBody.put("contents", contents);
        requestBody.put("generationConfig", Map.of("temperature", 0.7, "topP", 0.9));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(GEMINI_API_URL, HttpMethod.POST, requestEntity, String.class);
            String aiResponse = response.getBody();
            System.out.println("API Response: " + aiResponse);

            // Process AI response
            if (aiResponse.contains("FETCH_PROJECTS")) {
                return getProjectsForDepartment(departmentName);
            } else if (aiResponse.contains("COUNT_PROJECTS")) {
                long count = projectDAO.countProjectsByDepartment(departmentName);
                return "The " + departmentName + " department has a total of " + count + " projects.";
            } else if (aiResponse.contains("PENDING_PROJECTS")) {
                return getProjectsByStatus(departmentName, "pending");
            } else if (aiResponse.contains("ONGOING_PROJECTS")) {
                return getProjectsByStatus(departmentName, "Ongoing");
            } else if (aiResponse.contains("HIGH_BUDGET_PROJECTS")) {
                return getProjectsAboveBudget(departmentName, 200000);
            } else if (aiResponse.contains("PENDING_PROJECTS_COUNT")) {
                long count = projectDAO.countProjectsByDepartmentAndStatus(departmentName, "pending");
                return "The " + departmentName + " department has " + count + " pending projects.";
            } else if (aiResponse.contains("ONGOING_PROJECTS_COUNT")) {
                long count = projectDAO.countProjectsByDepartmentAndStatus(departmentName, " In-Progress");
                return "The " + departmentName + " department has " + count + " ongoing projects.";
            } else if (aiResponse.contains("HIGH_BUDGET_PROJECTS_COUNT")) {
                long count = projectDAO.countHighBudgetProjectsByDepartment(departmentName, 200000);
                return "The " + departmentName + " department has " + count + " high-budget projects.";
            }

            return aiResponse;
        } catch (Exception e) {
            System.out.println("Error calling Gemini API: " + e.getMessage());
            return "Error calling the external API: " + e.getMessage();
        }
    }


    public String getProjectsForDepartment(String departmentName) {
        List<Project> projects = projectDAO.findProjectsByDepartment(departmentName);

        if (projects.isEmpty()) {
            return "There are no ongoing projects in the " + departmentName + " department.";
        }

        StringBuilder projectList = new StringBuilder("Here are the ongoing projects for " + departmentName + ":\n\n");
        for (Project project : projects) {
            projectList.append("- **Project Title:** ").append(project.getProj_title()).append("\n")
                    .append("  - **Status:** ").append(project.getProj_status()).append("\n")
                    .append("  - **Location:** ").append(project.getProj_location()).append("\n")
                    .append("  - **Estimated Budget:** ₹").append(project.getProj_estimated_budget()).append("\n")
                    .append("  - **Start Date:** ").append(project.getProj_start_date()).append("\n")
                    .append("  - **End Date:** ").append(project.getProj_end_date()).append("\n\n");
        }

        return projectList.toString();
    }


   




    public String identifyDepartment(String deptCode) {
        System.out.println("Received department code: " + deptCode);
        Department department = departmentDAO.findByCode(deptCode);

        if (department == null) {
            System.out.println("Department not found for code: " + deptCode);
            return "Sorry, I couldn't find your department. Please check your code and try again.";
        }

        return "Welcome! You are identified as " + department.getDept_name() + " Department. How may I assist you today?";
    }


    public List<Project> getProjectsByDepartment(String departmentName) {
        return projectDAO.findProjectsByDepartment(departmentName);
    }

    public Project getProjectByName(String departmentName, String projectName) {
        return projectDAO.findProjectByName(departmentName, projectName);
    }

    public List<Project> getProjectsByDepartmentId(String deptId) {
        return projectDAO.findProjectsByDepartmentId(deptId);
    }



// latest

    public String getProjectsByStatus(String departmentName, String status) {
        List<Project> projects = projectDAO.findProjectsByDepartmentAndStatus(departmentName, status);

        if (projects.isEmpty()) {
            return "There are no " + status.toLowerCase() + " projects in the " + departmentName + " department.";
        }

        StringBuilder projectList = new StringBuilder("Here are the " + status.toLowerCase() + " projects for " + departmentName + ":\n\n");
        for (Project project : projects) {
            projectList.append("- **Project Title:** ").append(project.getProj_title()).append("\n")
                    .append("  - **Status:** ").append(project.getProj_status()).append("\n")
                    .append("  - **Budget:** ₹").append(project.getProj_estimated_budget()).append("\n\n");
        }

        return projectList.toString();
    }

    public String getProjectsAboveBudget(String departmentName, double budgetThreshold) {
        List<Project> projects = projectDAO.findProjectsByDepartmentAndBudgetGreaterThan(departmentName, budgetThreshold);

        if (projects.isEmpty()) {
            return "There are no projects with a budget greater than ₹" + budgetThreshold + " in the " + departmentName + " department.";
        }

        StringBuilder projectList = new StringBuilder("Here are the high-budget projects for " + departmentName + ":\n\n");
        for (Project project : projects) {
            projectList.append("- **Project Title:** ").append(project.getProj_title()).append("\n")
                    .append("  - **Budget:** ₹").append(project.getProj_estimated_budget()).append("\n")
                    .append("  - **Status:** ").append(project.getProj_status()).append("\n\n");
        }

        return projectList.toString();
    }

    public long getProjectCountByDepartment(String deptId) {
        return projectDAO.countProjectsByDepartment(deptId);
    }

    public List<Project> getPendingProjectsByDepartment(String deptId) {
        return projectDAO.findProjectsByDepartmentAndStatus(deptId, "pending");
    }
    public List<Project> getOngoingProjectsByDepartment(String departmentName) {
        // Fetch ongoing projects from ProjectDAO
        return projectDAO.findProjectsByDepartmentAndStatus(departmentName, "In-Progress");
    }

    public List<Project> getHighBudgetProjectsByDepartment(String departmentName, double budgetThreshold) {
        // Fetch projects with budget greater than the threshold
        return projectDAO.findProjectsByDepartmentAndBudgetGreaterThan(departmentName, budgetThreshold);
    }

    public long getProjectCountByDepartmentAndStatus(String deptId, String status) {
        return projectDAO.countProjectsByDepartmentAndStatus(deptId, status);
    }

    public long getHighBudgetProjectCountByDepartment(String deptId, double budgetThreshold) {
        return projectDAO.countHighBudgetProjectsByDepartment(deptId, budgetThreshold);
    }




}

package com.plan_it_urban.plan_it_urban.Service;

import com.plan_it_urban.plan_it_urban.Model.Task;
import com.plan_it_urban.plan_it_urban.Repository.TaskRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TaskService {
    @Autowired
    TaskRepository taskRepository;

    public void registerTask(Task task){
        taskRepository.registerTask(task);
    }

    public List<Map<String, Object>> fetchTasks(int officer_id){
        return taskRepository.fetchTasks(officer_id);
    }

    public List<Map<String, Object>> fetchRecentTasks(int officer_id){
        return taskRepository.fetchRecentTasks(officer_id);
    }

    public List<Map<String, Object>> fetchAllRecentTasks(){
        return taskRepository.fetchAllRecentTasks();
    }

    public Map<String, Object> getTaskProgressData() {
        List<Map<String, Object>> taskData = taskRepository.getTaskProgressData();

        List<String> labels = new ArrayList<>();
        List<Integer> taskCounts = new ArrayList<>();
        List<Double> avgProgress = new ArrayList<>();

        for (Map<String, Object> row : taskData) {
            labels.add((String) row.get("task_status"));
            taskCounts.add(((Number) row.get("count")).intValue());
            avgProgress.add(((Number) row.get("avg_progress")).doubleValue());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("taskCounts", taskCounts);
        response.put("avgProgress", avgProgress);
        return response;
    }

    public Map<String, Object> getBudgetDistribution(int deptId) {
        List<Map<String, Object>> budgetData = taskRepository.getBudgetDistribution(deptId);

        List<String> labels = new ArrayList<>();
        List<Double> budgetValues = new ArrayList<>();

        for (Map<String, Object> row : budgetData) {
            labels.add((String) row.get("proj_title"));
            budgetValues.add(((Number) row.get("proj_estimated_budget")).doubleValue());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("labels", labels);
        response.put("budgetValues", budgetValues);
        return response;
    }



    //officer dashboard
    public Map<String, Integer> fetchTaskStatusCounts(int officerId) {
        return taskRepository.fetchTaskStatusCounts(officerId);
    }

    public void updateTaskProgress(int taskId, int officerId, int progress) {
        taskRepository.updateTaskProgress(taskId, officerId, progress);
    }


    public void updateTaskProgressAndStatus(Long taskId, int progress, String status) {
        taskRepository.updateTaskProgressAndStatus(taskId, progress, status);
    }
}

package com.plan_it_urban.plan_it_urban.Controller;

import com.plan_it_urban.plan_it_urban.Model.Project;
import com.plan_it_urban.plan_it_urban.Model.Task;
import com.plan_it_urban.plan_it_urban.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class TaskController {
    @Autowired
    TaskService taskService;

    @PostMapping("/registerTask")
    @CrossOrigin(origins = "http://localhost:4200")
    public void registerTask(@RequestBody Task task){
        taskService.registerTask(task);
    }

    @GetMapping("/fetchTasks/{officer_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> fetchTasks(@PathVariable("officer_id") int officer_id){
        return taskService.fetchTasks(officer_id);
    }

    @GetMapping("/fetchRecentTasks/{officer_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> fetchRecentTasks(@PathVariable("officer_id") int officer_id){
        return taskService.fetchRecentTasks(officer_id);
    }

    @GetMapping("/fetchAllRecentTasks")
    @CrossOrigin(origins = "http://localhost:4200")
    public List<Map<String, Object>> fetchAllRecentTasks(){
        return taskService.fetchAllRecentTasks();
    }

    @GetMapping("/tasks/progress")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> getTaskProgress() {
        return ResponseEntity.ok(taskService.getTaskProgressData());
    }

    @GetMapping("/budget/{deptId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Object>> getBudgetData(@PathVariable("deptId") int deptId) {
        return ResponseEntity.ok(taskService.getBudgetDistribution(deptId));
    }



    //officer dashboard
    @GetMapping("/tasks/{officer_id}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<Map<String, Integer>> getTaskStatusCounts(@PathVariable("officer_id") int officerId) {
        return ResponseEntity.ok(taskService.fetchTaskStatusCounts(officerId));
    }


    @PutMapping("/updateProgress")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<String> updateTaskProgress(
            @RequestParam("taskId") int taskId,
            @RequestParam("officerId") int officerId,
            @RequestParam("progress") int progress) {

        taskService.updateTaskProgress(taskId, officerId, progress);
        return new ResponseEntity<>("Task progress updated successfully!", HttpStatus.OK);
    }

    @PutMapping("/update/{taskId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<String> updateTaskProgress(
            @PathVariable("taskId") Long taskId,
            @RequestBody Map<String, Object> payload) {

        int progress = (int) payload.get("task_progress");
        String status = (String) payload.get("task_status");

        taskService.updateTaskProgressAndStatus(taskId, progress, status);
        return ResponseEntity.ok("Task updated successfully.");
    }

}

package com.plan_it_urban.plan_it_urban.Repository;

import com.plan_it_urban.plan_it_urban.Model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class TaskRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

//    public void registerTask(Task task){
//        jdbcTemplate.update("CALL sp_register_task (?,?,?,?,?,?,?)",
//                task.getTask_title(),
//                task.getTask_desc(),
//                task.getTask_assign_to_officer(),
//                task.getTask_start_date(),
//                task.getTask_end_date(),
//                task.getTask_status(),
//                task.getTask_progress()
//        );
//        System.out.println("Task inserted");
//    }





    public void registerTask(Task task) {
        jdbcTemplate.update(
                "CALL sp_register_task (?,?,?,?,?,?,?,?,?)",
                task.getTask_title(),
                task.getTask_desc(),
                task.getTask_assign_to_officer(),
                task.getTask_start_date(),
                task.getTask_end_date(),
                task.getTask_status(),
                task.getTask_progress(),
                task.getProj_id(),
                task.getDept_name()
        );
        System.out.println("Task inserted");
    }



    public List<Map<String, Object>> fetchTasks(int officer_id){
        return jdbcTemplate.queryForList("SELECT *,CURRENT_TIME() AS curr_time from task where task_assign_to_officer = ?",officer_id);
    }

    public List<Map<String, Object>> fetchRecentTasks(int officer_id){
        return jdbcTemplate.queryForList("SELECT *,CURRENT_TIME() AS curr_time from task where task_assign_to_officer = ? ORDER BY curr_time DESC",officer_id);
    }

    public List<Map<String, Object>> fetchAllRecentTasks(){
        return jdbcTemplate.queryForList("SELECT * from task");
    }

    // Get task progress grouped by status for Task Bar Chart
    public List<Map<String, Object>> getTaskProgressData() {
        String sql = "SELECT task_status, AVG(task_progress) AS avg_progress, COUNT(*) AS count " +
                "FROM task GROUP BY task_status";
        return jdbcTemplate.queryForList(sql);
    }


    public List<Map<String, Object>> getBudgetDistribution(int deptId) {
        String sql = "SELECT p.proj_title, p.proj_estimated_budget " +
                "FROM project p " +
                "WHERE p.dept_id = ? and isApproved = 1";
        return jdbcTemplate.queryForList(sql, deptId);
    }



    //officer dashboard
    public Map<String, Integer> fetchTaskStatusCounts(int officerId) {
        String sql = "SELECT " +
                "SUM(CASE WHEN task_status = 'Completed' THEN 1 ELSE 0 END) AS completed, " +
                "SUM(CASE WHEN task_status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress, " +
                "SUM(CASE WHEN task_status = 'Pending' THEN 1 ELSE 0 END) AS pending " +
                "FROM task WHERE task_assign_to_officer = ?";

        return jdbcTemplate.query(sql, new Object[]{officerId}, rs -> {
            Map<String, Integer> result = new HashMap<>();
            if (rs.next()) {  // Ensure there's at least one row
                result.put("completed", rs.getInt("completed"));
                result.put("in_progress", rs.getInt("in_progress"));
                result.put("pending", rs.getInt("pending"));
            } else {
                // Default values if no tasks exist
                result.put("completed", 0);
                result.put("in_progress", 0);
                result.put("pending", 0);
            }
            return result;
        });
    }








    public void updateTaskProgress(int taskId, int officerId, int progress) {
        String sql = """
            UPDATE Task
            SET task_progress = ?
            WHERE task_id = ? AND task_assign_to_officer = ?
        """;

        jdbcTemplate.update(sql, progress, taskId, officerId);
    }


    public void updateTaskProgressAndStatus(Long taskId, int progress, String status) {
        String sql = "UPDATE task SET task_progress = ?, task_status = ? WHERE task_id = ?";

        jdbcTemplate.update(sql, progress, status, taskId);
    }


}

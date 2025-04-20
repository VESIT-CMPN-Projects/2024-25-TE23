package com.plan_it_urban.plan_it_urban.Repository;

import com.plan_it_urban.plan_it_urban.Model.Officer;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Repository
public class OfficerRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    @Autowired
    JavaMailSender mailSender;

//    public void registerOfficer(Officer officer){
//        jdbcTemplate.update("CALL sp_register_officer (?,?,?)",
//                officer.getOfficer_name(),
//                officer.getOfficerEmail(),
//                officer.getOfficer_dept()
////                officer.getUpload_gov_identity_proof(),
////                officer.getUpload_certificate_of_incorporation(),
////                officer.getUpload_attestation_officer_proof()
//        );
//        System.out.println("officer inserted");
//    }






    public void registerOfficer(Officer officer) {
        try {

            String randomPassword = generateRandomPassword(8);


            String sql = "SELECT dept_id FROM department WHERE dept_name = ?";
            Integer deptId = jdbcTemplate.queryForObject(sql, Integer.class, officer.getOfficer_dept());

            if (deptId != null) {

                jdbcTemplate.update("CALL sp_register_officer (?,?,?,?)",
                        officer.getOfficer_name(),
                        officer.getOfficerEmail(),
                        deptId,
                        randomPassword // Store random password
                );

                sendPasswordEmail(officer.getOfficerEmail(), randomPassword);

                System.out.println("Officer inserted and email sent successfully!");
            } else {
                System.err.println("Department not found: " + officer.getOfficer_dept());
            }
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }


    private String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        Random random = new Random();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }

    private void sendPasswordEmail(String recipientEmail, String password) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(recipientEmail);
        helper.setSubject("Your Officer Account Password");
        helper.setText("Hello,\n\nYour officer account has been created. Here is your password: " + password +
                "\n\nPlease change it after your first login.", false);

        mailSender.send(message);
        System.out.println("Email sent successfully to: " + recipientEmail);
    }


//    public void registerOfficer(Officer officer) {
//
//        String sql = "SELECT dept_id FROM department WHERE dept_name = ?";
//
//        try {
//            Integer deptId = jdbcTemplate.queryForObject(sql, Integer.class, officer.getOfficer_dept());
//
//            if (deptId != null) {
//                jdbcTemplate.update("CALL sp_register_officer (?,?,?)",
//                        officer.getOfficer_name(),
//                        officer.getOfficerEmail(),
//                        deptId
//                );
//                System.out.println("Officer inserted successfully");
//                System.out.println( "email: " +officer.getOfficerEmail());
//            } else {
//                System.err.println("Error: Department not found for name: " + officer.getOfficer_dept());
//            }
//        } catch (Exception e) {
//            System.err.println("Error fetching department ID: " + e.getMessage());
//        }
//    }


    public List<Map<String, Object>> fetchOfficers(){
        return jdbcTemplate.queryForList("SELECT * from officer");
    }





    public List<Map<String, Object>> fetchOfficersByDept(int dept_id){
        String query = """
        SELECT o.*, d.dept_name, d.dept_id
        FROM officer o
        JOIN department d 
        ON 
            o.officer_dept = d.dept_name   -- For name-based entries
            OR o.officer_dept = d.dept_id  -- For ID-based entries
        WHERE d.dept_id = ?
    """;

        return jdbcTemplate.queryForList(query, dept_id);
    }






    private final Map<Long, int[]> taskData = new HashMap<>();
    public OfficerRepository() {
        // Mock data: {officerId -> [Completed, In Progress, Pending]}
        taskData.put(27L, new int[]{10, 5, 2});
        taskData.put(4L, new int[]{7, 3, 4});
    }

    public int[] getTaskProgress(Long officerId) {
        return taskData.getOrDefault(officerId, new int[]{0, 0, 0});
    }

    public List<Map<String, Object>> fetchAssignedTasks(int officer_id){
        return jdbcTemplate.queryForList( "Select * from task where task_assign_to_officer = ?",
                officer_id);
    }









}

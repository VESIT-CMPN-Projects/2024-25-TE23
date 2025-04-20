package com.plan_it_urban.plan_it_urban.Service;

import com.plan_it_urban.plan_it_urban.Model.Officer;
import com.plan_it_urban.plan_it_urban.Model.User;
import com.plan_it_urban.plan_it_urban.Repository.AuthRepository;
import com.plan_it_urban.plan_it_urban.Repository.OfficerJpaRepository;
import com.plan_it_urban.plan_it_urban.Repository.OfficerRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.security.SecureRandom;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    @Autowired
    AuthRepository authRepository;

    @Autowired
    OfficerRepository officerRepository;

    @Autowired
    OfficerJpaRepository officerJpaRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    public Map<String, Object> login(String username, String password, String role) {
        System.out.println("Username recived in Service "+username);
        return authRepository.login(username, password, role);
    }

    public Map<String,Object> fetchLoggedInDepartment(int dept_id){
        return authRepository.fetchLoggedInDepartment(dept_id);
    }

    public Map<String,Object> fetchLoggedInOfficer(int officer_id){
        return authRepository.fetchLoggedInOfficer(officer_id);
    }

    public Map<String,Object> fetchLoggedInCommissioner(int commissioner_id){
        return authRepository.fetchLoggedInCommissioner(commissioner_id);
    }

    public ResponseEntity<?> registerOfficer(Officer officer) {
        officerJpaRepository.save(officer);
        sendMail(officer);
        return ResponseEntity.ok("Officer registered. Department will review the request.");
    }

    private void sendMail(Officer officer) {
        String departmentEmail = "department@gmail.com";

        String approvalLink = "http://localhost:8080/approve-officer/" + officer.getOfficerEmail();
        String rejectionLink = "http://localhost:8080/reject-officer/" + officer.getOfficerEmail();

        String emailContent = "<p>New Officer Registration Request:</p>" +
                "<p>Name: " + officer.getOfficer_name() + "</p>" +
                "<p>Email: " + officer.getOfficerEmail() + "</p>" +
                "<p>Department: " + officer.getOfficer_dept() + "</p>" +
//                "<p>Govt ID Proof: " + officer.getUploadGovIdentityProof() + "</p>" +
//                "<p>Certificate: " + officer.getUploadCertificateOfIncorporation() + "</p>" +
                "<br/>" +
                "<a href='" + approvalLink + "' style='padding:10px;background:green;color:white;text-decoration:none;'>Approve</a> " +
                "<a href='" + rejectionLink + "' style='padding:10px;background:red;color:white;text-decoration:none;'>Reject</a>";

        sendEmail(departmentEmail, "New Officer Registration Request", emailContent);
    }

    public ResponseEntity<?> approveOfficer(String id) {
        Optional<Officer> officerOpt = officerJpaRepository.findByOfficerEmail(id);
        if (officerOpt.isPresent()) {
            Officer officer = officerOpt.get();
            /*String resetLink = "http://localhost:4200/reset-password?email=" + officer.getOfficerEmail();*/
            sendPasswordSetup(officer.getOfficerEmail());
            return ResponseEntity.ok("Officer approved. Password setup email sent.");
        }
        return ResponseEntity.status(404).body("Officer not found.");
    }

    public ResponseEntity<?> rejectOfficer(String emailId) {

        try{
            sendRejectionMail(emailId);
            return ResponseEntity.ok("Rejection email sent.");
        } catch (Exception e) {
            System.out.println("User not Found !!!");
            throw new RuntimeException(e);
        }

    }

    public ResponseEntity<?> sendPasswordSetup(String email) {
        // Generate a random password
        String randomPassword = generateRandomPassword();

        // Update the password in the repository
        authRepository.updatePassword(email, randomPassword); // Ensure this method exists in your repository

        // Create email content with credentials
        String emailContent = "<p>Your registration has been approved. Here are your login credentials:</p>"
                + "<p>Email: <strong>" + email + "</strong></p>"
                + "<p>Password: <strong>" + randomPassword + "</strong></p>"
                + "<p>Please use these credentials to log into your account.</p>";

        sendEmail(email, "Your Login Credentials", emailContent);
        return ResponseEntity.ok("Password setup email sent.");
    }

    private String generateRandomPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            int index = random.nextInt(chars.length());
            sb.append(chars.charAt(index));
        }
        return sb.toString();
    }
    private void sendRejectionMail(String email) {
        String emailContent = "Your officer registration request has been rejected. Please contact the department for more details.";
        sendEmail(email, "Officer Registration Rejected", emailContent);
        authRepository.rejectionEmailDeleteUser(email);
    }

    private void sendEmail(String to, String subject, String content) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content,         true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}

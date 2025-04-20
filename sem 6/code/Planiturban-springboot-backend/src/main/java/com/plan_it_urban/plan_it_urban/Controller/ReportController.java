package com.plan_it_urban.plan_it_urban.Controller;


import com.plan_it_urban.plan_it_urban.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/generate/{departmentId}")
    @CrossOrigin(origins = "http://localhost:4200")
    public ResponseEntity<byte[]> generateReport(@PathVariable("departmentId") int departmentId) {
        try {
            byte[] pdf = reportService.generateReport(departmentId);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=report.pdf");
            return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}


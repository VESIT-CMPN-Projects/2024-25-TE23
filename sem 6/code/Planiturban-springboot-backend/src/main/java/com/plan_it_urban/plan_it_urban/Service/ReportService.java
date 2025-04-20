package com.plan_it_urban.plan_it_urban.Service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.ByteArrayOutputStream;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private JdbcTemplate jdbcTemplate;



    private final String GEMINI_API_KEY = "AIzaSyAUUosEUHY49ehxJce4de7AHefkjnzESLk";
    private final String GEMINI_URL =  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("dd MMM yyyy");

    public byte[] generateReport(int departmentId) throws Exception {
        List<Map<String, Object>> projects = jdbcTemplate.queryForList(
                "SELECT proj_id, proj_title, proj_desc, proj_location, proj_latitude, proj_longitude, " +
                        "proj_start_date, proj_end_date, proj_estimated_budget, proj_status " +
                        "FROM Project WHERE dept_id = ?", departmentId);

        if (projects.isEmpty()) {
            return new byte[0];
        }

        StringBuilder reportContent = new StringBuilder();
        for (Map<String, Object> project : projects) {
            reportContent.append("Project: ").append(project.get("proj_title"))
                    .append(" | Status: ").append(project.get("proj_status"))
                    .append("\n");
        }

        String summary = getGeminiSummary(reportContent.toString());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdfDocument = new PdfDocument(writer);
        Document document = new Document(pdfDocument);


        document.add(new Paragraph("Urban Planning Project Report")
                .setBold()
                .setFontSize(18)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20));


        document.add(new Paragraph("Project Details")
                .setBold()
                .setFontSize(14)
                .setUnderline()
                .setMarginBottom(10));

        float[] columnWidths = {1, 2, 3, 2, 2, 2, 2, 2, 2, 2};
        Table table = new Table(UnitValue.createPercentArray(columnWidths)).useAllAvailableWidth();
        table.setTextAlignment(TextAlignment.CENTER);

        String[] headers = {"ID", "Title", "Description", "Location", "Latitude", "Longitude", "Start Date", "End Date", "Budget", "Status"};
        for (String header : headers) {
            table.addHeaderCell(new Cell().add(new Paragraph(header).setBold().setFontSize(12))
                    .setBackgroundColor(ColorConstants.LIGHT_GRAY));
        }

        for (Map<String, Object> project : projects) {
            table.addCell(new Cell().add(new Paragraph(project.get("proj_id").toString())));
            table.addCell(new Cell().add(new Paragraph(project.get("proj_title").toString())));
            table.addCell(new Cell().add(new Paragraph(project.get("proj_desc").toString())));
            table.addCell(new Cell().add(new Paragraph(project.get("proj_location").toString())));
            table.addCell(new Cell().add(new Paragraph(project.get("proj_latitude").toString())));
            table.addCell(new Cell().add(new Paragraph(project.get("proj_longitude").toString())));
            table.addCell(new Cell().add(new Paragraph(dateFormat.format(project.get("proj_start_date")))));
            table.addCell(new Cell().add(new Paragraph(dateFormat.format(project.get("proj_end_date")))));
            table.addCell(new Cell().add(new Paragraph(String.format("$%.2f", project.get("proj_estimated_budget")))));
            table.addCell(new Cell().add(new Paragraph(project.get("proj_status").toString())));
        }

        document.add(table.setMarginBottom(20));


        document.add(new Paragraph("AI-Generated Project Summary")
                .setBold()
                .setFontSize(14)
                .setUnderline()
                .setMarginBottom(10));

        String[] summaryLines = summary.split("\n");
        for (String line : summaryLines) {
            if (line.startsWith("**")) {
                document.add(new Paragraph(line.replace("**", ""))
                        .setBold()
                        .setFontSize(12)
                        .setMarginTop(10));
            } else if (line.startsWith("Challenge:")) {
                document.add(new Paragraph("Challenge: " + line.replace("Challenge:", ""))
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(5));
            } else if (line.startsWith("Solution:")) {
                document.add(new Paragraph("Solution: " + line.replace("Solution:", ""))
                        .setBold()
                        .setFontSize(11)
                        .setMarginTop(5));
            } else if (line.startsWith("• ")) {
                document.add(new Paragraph("• " + line.replace("• ", ""))
                        .setFontSize(11)
                        .setMarginLeft(15));
            } else {
                document.add(new Paragraph(line)
                        .setFontSize(11)
                        .setTextAlignment(TextAlignment.JUSTIFIED)
                        .setMarginLeft(10));
            }
        }

        document.close();
        return out.toByteArray();
    }

    private String getGeminiSummary(String content) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String requestBody = "{" +
                "\"contents\":[{\"role\":\"user\",\"parts\":[{\"text\":\"Generate a detailed project report including project descriptions, key challenges, and their solutions based on the following data: " + content + "\"}]}]," +
                "\"generationConfig\":{\"temperature\":0.8,\"topP\":0.9}" +
                "}";

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(GEMINI_URL, HttpMethod.POST, request, Map.class);

        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
        if (candidates != null && !candidates.isEmpty()) {
            Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, String>> parts = (List<Map<String, String>>) contentMap.get("parts");
            return parts.get(0).get("text");
        }
        return "No summary available.";
    }
}


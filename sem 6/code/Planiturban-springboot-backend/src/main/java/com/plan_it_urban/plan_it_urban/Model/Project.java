package com.plan_it_urban.plan_it_urban.Model;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Project {
    private int proj_id;
    private int dept_id;
    private String proj_title;
    private String proj_desc;
    private String proj_location;
    private double proj_latitude;
    private double proj_longitude;
    private Date proj_start_date;
    private Date proj_end_date;
    private double proj_estimated_budget;
    private String proj_status;

}

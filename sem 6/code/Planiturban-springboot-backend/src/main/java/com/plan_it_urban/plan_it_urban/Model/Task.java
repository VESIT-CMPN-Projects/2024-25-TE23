package com.plan_it_urban.plan_it_urban.Model;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Task {
    private int task_id;
    private String task_title;
    private String task_desc;
    private int task_assign_to_officer;
    private Date task_start_date;
    private Date task_end_date;
    private String task_status;
    private int task_progress;
    private int proj_id;
    private String dept_name;
}

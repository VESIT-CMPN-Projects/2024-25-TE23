package com.plan_it_urban.plan_it_urban.Controller;

import com.plan_it_urban.plan_it_urban.Model.Department;
import com.plan_it_urban.plan_it_urban.Service.DepartmentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/departments")
@CrossOrigin(origins = "http://localhost:4200")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/{deptId}")
    public Department getDepartmentById(@PathVariable("deptId") int deptId) {
        return departmentService.getDepartmentById(deptId);
    }
}

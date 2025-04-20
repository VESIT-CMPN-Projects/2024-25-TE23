package com.plan_it_urban.plan_it_urban.Service;

import com.plan_it_urban.plan_it_urban.Model.Department;
import com.plan_it_urban.plan_it_urban.Repository.DepartmentRepository;
import org.springframework.stereotype.Service;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department getDepartmentById(int deptId) {
        return departmentRepository.findById(deptId);
    }
}

package com.plan_it_urban.plan_it_urban;

import com.plan_it_urban.plan_it_urban.Model.Project;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@EntityScan(basePackages = "com.plan_it_urban.plan_it_urban.Model")
@SpringBootApplication
public class PlanItUrbanApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlanItUrbanApplication.class, args);
		System.out.println("Hello ");
	}

}

package com.example.Food_Management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.example.Food_Management.model")

public class FoodManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodManagementApplication.class, args);
	}

}

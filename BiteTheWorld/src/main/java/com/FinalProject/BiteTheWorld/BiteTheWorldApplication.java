package com.FinalProject.BiteTheWorld;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.FinalProject.BiteTheWorld") // Ensure correct package
public class BiteTheWorldApplication {
    public static void main(String[] args) {
        SpringApplication.run(BiteTheWorldApplication.class, args);
    }
}

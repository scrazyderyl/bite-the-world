package com.FinalProject.BiteTheWorld;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // Allow requests from frontend
public class AuthController {
    private final AccountSystem accountSystem;

    public AuthController() {
        this.accountSystem = new AccountSystem();
    }

    // Register a new user
    @PostMapping("/register")
    public Map<String, String> register(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");

        boolean success = accountSystem.register(name, email, password);
        Map<String, String> response = new HashMap<>();
        response.put("status", success ? "success" : "error");
        return response;
    }

    // Request password reset
    @PostMapping("/reset-password")
    public Map<String, String> requestPasswordReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean success = accountSystem.requestPasswordReset(email);
        Map<String, String> response = new HashMap<>();
        response.put("status", success ? "success" : "error");
        return response;
    }

    // Change email
    @PostMapping("/change-email")
    public Map<String, String> changeEmail(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String newEmail = request.get("newEmail");

        boolean success = accountSystem.changeEmail(userId, newEmail);
        Map<String, String> response = new HashMap<>();
        response.put("status", success ? "success" : "error");
        return response;
    }

    // Delete account
    @PostMapping("/delete-account")
    public Map<String, String> deleteAccount(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");

        boolean success = accountSystem.deleteAccount(userId);
        Map<String, String> response = new HashMap<>();
        response.put("status", success ? "success" : "error");
        return response;
    }
}

package com.FinalProject.BiteTheWorld;

import org.springframework.web.bind.annotation.*;

import org.springframework.http.ResponseEntity;

import com.google.firebase.auth.FirebaseAuthException;

@RestController
@RequestMapping("/account")
public class AuthController {
    private final AccountSystem accountSystem;

    public AuthController() {
        this.accountSystem = new AccountSystem();
    }

    // Delete account
    @PostMapping("/delete-account")
    public ResponseEntity<String> deleteAccount(@RequestBody IdToken idToken) {
        try {
            String userId = accountSystem.getUID(idToken.idToken);

            if (!accountSystem.deleteAccount(userId)) {
                return ResponseEntity.internalServerError().build();
            }

            return ResponseEntity.ok().build();
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).body("Failed to authenticate user");
        }
    }
}

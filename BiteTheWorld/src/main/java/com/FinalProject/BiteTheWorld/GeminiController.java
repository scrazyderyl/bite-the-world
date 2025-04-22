package com.FinalProject.BiteTheWorld;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.google.firebase.auth.FirebaseAuthException;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/gemini")
public class GeminiController {

    private final ContentSystem contentSystem;
    private final AccountSystem accountSystem;

    public GeminiController(ContentSystem contentSystem) {
        this.contentSystem = contentSystem;
        this.accountSystem = AccountSystem.getInstance();
    }

    @PostMapping("/recommendations")
public ResponseEntity<List<RecipeOverview>> getRecommendations(@RequestBody IdToken idToken) {
    try {
        String userId = accountSystem.getUID(idToken.idToken);
        List<RecipeOverview> recommendations = contentSystem.recommendFromHistory(userId);

        // LOGGING for debug
        System.out.println("Sending recommendations: " + recommendations.size());

        return ResponseEntity.ok(recommendations);
    } catch (FirebaseAuthException e) {
        System.err.println("Auth failed: " + e.getMessage());

        // Option A: return an empty list
        return ResponseEntity.status(401).body(Collections.emptyList());

        // Option B (better): return JSON error
        // return ResponseEntity.status(401).body(Collections.singletonMap("error", "Unauthorized"));
    }
}

}

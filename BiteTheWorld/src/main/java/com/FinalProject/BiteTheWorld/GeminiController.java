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

import java.util.List;

@RestController
@RequestMapping("/api/gemini")
public class GeminiController {

    private final ContentSystem contentSystem;

    public GeminiController(ContentSystem contentSystem) {
        this.contentSystem = contentSystem;
    }

    @PostMapping("/recommendations")
    public ResponseEntity<List<Recipe>> getRecommendations(@RequestBody History history) {
        List<Recipe> recommendations = contentSystem.recommendFromHistory(history);
        return ResponseEntity.ok(recommendations);
    }
}

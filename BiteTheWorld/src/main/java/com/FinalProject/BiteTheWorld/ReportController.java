package com.FinalProject.BiteTheWorld;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.firebase.auth.FirebaseAuthException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/reports")
public class ReportController {
    private final ContentSystem contentSystem;

    public ReportController() {
        this.contentSystem = ContentSystem.getInstance();
    }

    @PostMapping("/{id}")
    public ResponseEntity<Report> get(@PathVariable String id, @RequestBody IdToken idToken) {
        try {
            Report report = contentSystem.getDocument("reports", id).toObject(Report.class);
            
            if (report == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(report);
        }  catch (Exception e) {
            System.out.println("Erorr: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(value = "/")
    public ResponseEntity<String> submit(@RequestBody @Valid ReportSubmission submission) {
        try {
            Report report = submission.toReport();
            String id = contentSystem.submit("reports", report);

            if (id == null) {
                return ResponseEntity.internalServerError().build();
            }

            return ResponseEntity.ok(id);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        boolean deleted = contentSystem.deleteById("reports", id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
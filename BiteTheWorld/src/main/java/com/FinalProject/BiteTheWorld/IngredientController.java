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
@RequestMapping("/ingredients")
public class IngredientController {
    private final ContentSystem contentSystem;

    public IngredientController() {
        this.contentSystem = ContentSystem.getInstance();
    }

    @PostMapping("/{id}")
    public ResponseEntity<Ingredient> get(@PathVariable String id) {
        try {
            Ingredient ingredient = contentSystem.getDocument("ingredients", id).toObject(Ingredient.class);
            
            if (ingredient == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(ingredient);
        }  catch (Exception e) {
            System.out.println("Erorr: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(value = "/")
    public ResponseEntity<String> submit(@RequestBody @Valid IngredientSubmission submission) {
        try {
            Ingredient ingredient = submission.toIngredient();
            String id = contentSystem.submit("ingredients", ingredient);

            if (id == null) {
                return ResponseEntity.internalServerError().build();
            }

            return ResponseEntity.ok(id);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).body("Failed to authenticate user");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        boolean deleted = contentSystem.deleteById("ingredients", id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
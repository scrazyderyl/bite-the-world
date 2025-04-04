package com.FinalProject.BiteTheWorld;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.google.firebase.auth.FirebaseAuthException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/recipes")
public class RecipeController {
    private final ContentSystem contentSystem;

    public RecipeController() {
        this.contentSystem = ContentSystem.getInstance();
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> get(@PathVariable String id, @RequestBody IdToken idToken) {
        try {
            Recipe recipe = contentSystem.getDocument("recipes", id).toObject(Recipe.class);
            
            if (recipe == null) {
                return ResponseEntity.notFound().build();
            }

            // Pass UID as context to serializer for ratings
            String userId = idToken.idToken == null ? null : FirebaseConnection.getUID(idToken.idToken);
            ObjectMapper mapper = new ObjectMapper();
            ObjectWriter writer = mapper.writer().withAttribute("uid", userId);

            String serializedRecipe = writer.writeValueAsString(recipe);

            return ResponseEntity.ok(serializedRecipe);
        }  catch (Exception e) {
            System.out.println("Erorr: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(value = "/")
    public ResponseEntity<String> submit(@RequestBody @Valid RecipeSubmission submission) {
        try {
            Recipe recipe = submission.toRecipe();
            String id = contentSystem.submit("recipes", recipe);

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
        boolean deleted = contentSystem.deleteById("recipes", id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}

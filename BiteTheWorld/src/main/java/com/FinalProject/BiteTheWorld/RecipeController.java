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


@RestController
@RequestMapping("/recipes")
public class RecipeController {
    private final ContentSystem contentSystem;
    private final AccountSystem accountSystem;

    public RecipeController() {
        this.contentSystem = ContentSystem.getInstance();
        this.accountSystem = AccountSystem.getInstance();
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> get(@PathVariable String id, @RequestBody IdToken idToken) {
        try {
            Recipe recipe = contentSystem.getDocument("recipes", id).toObject(Recipe.class);

            if (recipe == null) {
                return ResponseEntity.notFound().build();
            }
            
            ObjectMapper mapper = new ObjectMapper();
            ObjectWriter writer;
            
            // If user is not logged in
            if (idToken.idToken == null) {
                writer = mapper.writer().withAttribute("uid", null);
            } else {
                String userId = accountSystem.getUID(idToken.idToken);
                writer = mapper.writer().withAttribute("uid", userId); // Pass uid to serializer for user ratings
                accountSystem.addToHistory(userId, id); // Add to history
            }

            String serializedRecipe = writer.writeValueAsString(recipe);
            contentSystem.updateRecipeViews(id, recipe.views);

            return ResponseEntity.ok(serializedRecipe);
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(value = "/")
    public ResponseEntity<String> submit(@RequestBody @Valid RecipeSubmission submission) {
        try {
            System.out.println("Submitting recipe: " + submission.name);
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

   
    @GetMapping("/featured")
    public ResponseEntity<Recipe> getFeaturedRecipe() {
        contentSystem.updateFeaturedRecipe(); // Refresh top-viewed
        Recipe featured = contentSystem.getFeaturedRecipe();
        if (featured == null) {
            return ResponseEntity.notFound().build();
        }   
        return ResponseEntity.ok(featured);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        boolean deleted = contentSystem.deleteById("recipes", id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}

package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.ExecutionException;

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

    @PostMapping("/")
    public ResponseEntity<String> submit(@RequestBody @Valid RecipeSubmission submission) {
        try {
            Recipe recipe = submission.toRecipe();
            String id = contentSystem.submit("recipes", recipe);

            if (id == null) {
                return ResponseEntity.internalServerError().build();
            }

            return ResponseEntity.ok(id);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/edit/{id}")
    public ResponseEntity<String> edit(@PathVariable String id, @RequestBody @Valid RecipeSubmission submission) {
        try {
        // Check if user is authorized to edit recipe
            String uid = accountSystem.getUID(submission.idToken);
            
            if (uid == null || !contentSystem.userCanEdit("recipes", id, uid)) {
                return ResponseEntity.status(401).build();
            }

            HashMap<String, Object> edits = submission.toMap();

            // Rebuild ingredient id array
            ArrayList<String> ingredientIds = new ArrayList<>(submission.ingredients.size());

            for (IngredientWithQuantity ingredient : submission.ingredients) {
                ingredientIds.add(ingredient.id);
            }

            edits.put("ingredientsstrings", ingredientIds);
            edits.put("lastUpdated", new Date());

            boolean edited = contentSystem.editById("recipes", id, edits);
            return edited ? ResponseEntity.ok(id) : ResponseEntity.internalServerError().build();
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).build();
        } catch (InterruptedException | ExecutionException e) {
            return ResponseEntity.internalServerError().build();
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

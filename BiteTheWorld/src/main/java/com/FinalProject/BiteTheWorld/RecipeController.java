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

import jakarta.validation.Valid;

@RestController
@RequestMapping("/recipes")
public class RecipeController {
    private final ContentSystem contentSystem;

    public RecipeController(ContentSystem contentSystem) {
        this.contentSystem = contentSystem;
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> getRecipe(@PathVariable String id, @RequestBody IdToken idToken) {
        try {
            Recipe recipe = contentSystem.getRecipeByID(id);
            
            if (recipe == null) {
                return ResponseEntity.notFound().build();
            }

            String userId = idToken.idToken == null ? null : FirebaseConnection.getUID(idToken.idToken);

            ObjectMapper mapper = new ObjectMapper();
            ObjectWriter writer = mapper.writer().withAttribute("uid", userId);
            String serializedRecipe = writer.writeValueAsString(recipe);

            return ResponseEntity.ok(serializedRecipe);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving recipe: " + e.getMessage());
        }
    }

    @PostMapping(value = "/")
    public ResponseEntity<String> submitRecipe(@RequestBody @Valid RecipeSubmission submission) {
        try {
            Recipe recipe = submission.toRecipe();
            contentSystem.submitRecipe(recipe);
            return ResponseEntity.ok("Recipe submitted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error submitting recipe: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecipe(@PathVariable int id) {
        boolean deleted = contentSystem.deleteById(id);
        return deleted ? ResponseEntity.ok("Recipe deleted successfully") : ResponseEntity.notFound().build();
    }
}

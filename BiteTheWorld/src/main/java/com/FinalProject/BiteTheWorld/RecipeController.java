package com.FinalProject.BiteTheWorld;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

    private final ContentSystem contentSystem;

    public RecipeController() {
        // For simplicity; in a real app, you'd inject this via dependency injection.
        this.contentSystem = new ContentSystem();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipe(@PathVariable int id) {
        Recipe recipe = contentSystem.getRecipeByID(id);
        return recipe != null ? ResponseEntity.ok(recipe) : ResponseEntity.notFound().build();
    }
    
    // Other endpoints for submitting recipes, comments, etc.
}

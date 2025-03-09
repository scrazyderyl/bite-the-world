package com.FinalProject.BiteTheWorld;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

    private final ContentSystem contentSystem;

    public RecipeController(ContentSystem contentSystem) {
        this.contentSystem = contentSystem;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipe(@PathVariable int id) {
        Recipe recipe = contentSystem.getRecipeByID(id);
        return recipe != null ? ResponseEntity.ok(recipe) : ResponseEntity.notFound().build();
    }

    @PostMapping("/")
    public ResponseEntity<String> submitRecipe(@RequestBody Recipe recipe) {
        contentSystem.submitRecipe(recipe);
        return ResponseEntity.ok("Recipe submitted successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecipe(@PathVariable int id) {
        boolean deleted = contentSystem.deleteById(id);
        return deleted ? ResponseEntity.ok("Recipe deleted successfully") : ResponseEntity.notFound().build();
    }
}

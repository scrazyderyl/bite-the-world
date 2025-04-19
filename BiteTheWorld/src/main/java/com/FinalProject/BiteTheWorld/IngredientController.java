package com.FinalProject.BiteTheWorld;

import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuthException;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/ingredients")
public class IngredientController {
    private final Firestore db;
    private final ContentSystem contentSystem;

    public IngredientController() {
        db = FirebaseConnection.getDatabase();
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

    @PostMapping("/getrecipe")
    public ResponseEntity<Recipe> getRecipes(@RequestBody @Valid String[] ingredients) {
        try {
            Recipe recipe = contentSystem.getRecipeByIngredient(ingredients);
            if (recipe == null) {
                System.out.println("No recipe found with the given ingredients.");
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(recipe);
        }  catch (Exception e) {
            System.out.println("Erorr: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping(value = "/")
    public ResponseEntity<Ingredient> submit(@RequestBody @Valid IngredientSubmission submission) {
        try {
            Ingredient ingredient = submission.toIngredient();
            String id = contentSystem.submit("ingredients", ingredient);

            if (id == null) {
                return ResponseEntity.internalServerError().build();
            }

            contentSystem.ingredients.put(id, ingredient);

            ingredient = contentSystem.getDocument("ingredients", id).toObject(Ingredient.class);
            return ResponseEntity.ok(ingredient);
        } catch (FirebaseAuthException e) {
            return ResponseEntity.status(401).build();
        } catch (InterruptedException | ExecutionException ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable String id) {
        if (contentSystem.deleteById("ingredients", id)) {
            contentSystem.ingredients.remove(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/lookup")
    public ResponseEntity<List<Ingredient>> lookupIngredientsByName(@RequestBody SearchContext name) {
        List<Ingredient> results = contentSystem.lookupIngredientsByName(name.query, 5);
        return ResponseEntity.ok(results);
    }
}
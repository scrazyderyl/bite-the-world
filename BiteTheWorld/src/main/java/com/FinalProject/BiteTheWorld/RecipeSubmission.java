package com.FinalProject.BiteTheWorld;

import java.util.List;

import com.google.firebase.auth.FirebaseAuthException;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

class RecipeSubmission {
    public String idToken;

    @NotBlank
    @Size(max = 127)
    public String name;

    public List<String> tags;

    @NotEmpty
    public List<Country> countries;

    @NotBlank
    public String description;

    public List<String> images;

    @Positive
    public int prepTime;
    
    @Positive
    public int cookTime;

    @Positive
    public int servings;

    @Size(min = 1)
    public List<IngredientWithQuantity> ingredients;

    @Size(min = 1)
    public List<String> directions;

    public String notes;
    
    public RecipeSubmission() {
        
    }

    public Recipe toRecipe() throws FirebaseAuthException {
        String authorId = AccountSystem.getInstance().getUID(idToken);

        return new Recipe(name, authorId, tags, countries, description, images, prepTime, cookTime, servings, ingredients,
                directions, notes);
    }
}
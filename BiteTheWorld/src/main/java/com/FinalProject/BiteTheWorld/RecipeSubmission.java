package com.FinalProject.BiteTheWorld;

import java.util.List;

import org.hibernate.validator.constraints.URL;

import com.google.firebase.auth.FirebaseAuthException;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

class RecipeSubmission {
    @NotNull
    public String idToken;

    @NotBlank
    @Size(max = 127)
    public String name;

    public List<String> tags;

    @NotEmpty
    public List<Country> countries;

    @NotBlank
    public String description;

    public List<@URL String> images;

    @Positive
    public int prepTime;
    
    @Positive
    public int cookTime;

    @Positive
    public int servings;

    @NotEmpty
    public List<IngredientWithQuantity> ingredients;

    @NotEmpty
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
package com.FinalProject.BiteTheWorld;

import java.util.HashMap;
import java.util.List;

import javax.annotation.Nonnegative;

import org.hibernate.validator.constraints.URL;

import com.google.firebase.auth.FirebaseAuthException;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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

    @Nonnegative
    public int prepTime;
    
    @Nonnegative
    public int cookTime;

    @Nonnegative
    public int servings;

    @NotEmpty
    public List<IngredientWithQuantity> ingredients;

    @NotEmpty
    public List<String> directions;

    public String notes;
    
    public RecipeSubmission() {
        
    }

    public List<String> ingredientStrings(List<IngredientWithQuantity> ingredients) {
        return ingredients.stream().map(ingredient -> ingredient.name).toList();
    }

    public Recipe toRecipe() throws FirebaseAuthException {
        String authorId = AccountSystem.getInstance().getUID(idToken);

        return new Recipe(name, authorId, tags, countries, description, images, prepTime, cookTime, servings, ingredients,
                directions, notes, ingredientStrings(ingredients));
    }

    public HashMap<String, Object> toMap() {
        HashMap<String, Object> map = new HashMap<>() {{
            put("name", name);
            put("tags", tags);
            put("countries", countries);
            put("description", description);
            put("images", images);
            put("prepTime", prepTime);
            put("cookTime", cookTime);
            put("servings", servings);
            put("ingredients", ingredients);
            put("directions", directions);
            put("notes", notes);
        }};

        return map;
    }
}
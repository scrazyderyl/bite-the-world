package com.FinalProject.BiteTheWorld;

import org.hibernate.validator.constraints.URL;

import com.google.firebase.auth.FirebaseAuthException;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

class IngredientSubmission {
    @NotNull
    public String idToken;

    @NotBlank
    public String name;

    @URL
    public String image;

    @NotBlank
    public String description;

    public IngredientSubmission() {

    }

    public Ingredient toIngredient() throws FirebaseAuthException {
        String authorId = AccountSystem.getInstance().getUID(idToken);
        
        return new Ingredient(name, authorId, image, description);
    }
}

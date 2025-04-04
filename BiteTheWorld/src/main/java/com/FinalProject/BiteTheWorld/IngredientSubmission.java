package com.FinalProject.BiteTheWorld;

import com.google.firebase.auth.FirebaseAuthException;

import jakarta.validation.constraints.NotBlank;

class IngredientSubmission {
    public String idToken;

    @NotBlank
    public String name;

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

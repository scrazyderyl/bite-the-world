package com.FinalProject.BiteTheWorld;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

class IngredientWithQuantity {
    @NotNull
    public String id;

    @NotBlank
    public String name;

    @NotBlank
    public String quantity;

    @NotBlank
    public String quantityUnit;

    public IngredientWithQuantity() {
        
    }
}
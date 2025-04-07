package com.FinalProject.BiteTheWorld;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

class IngredientWithQuantity {
    // @NotNull
    public int id;

    @NotNull
    @NotBlank
    public String name;

    @NotNull
    public Fraction quantity;

    @NotNull
    @Size(min = 1)
    public String quantityUnit;

    public IngredientWithQuantity() {
        
    }
}
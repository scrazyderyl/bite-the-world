package com.FinalProject.BiteTheWorld;

class IngredientWithQuantity {
    public int id;
    public String name;
    public Fraction quantity;
    public String quantityUnit;

    public IngredientWithQuantity(int id, String name, Fraction quantity, String description, String quantityUnit) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.quantityUnit = quantityUnit;
    }
}
package com.FinalProject.BiteTheWorld;

class IngredientWithQuantity extends Ingredient {
    protected int id;
    protected String name;
    protected Fraction quantity;
    protected String quantityUnit;
    public IngredientWithQuantity(int id, String name, Fraction quantity, String description,String quantityUnit) {
        super(id, name, name, description);
        this.quantity = quantity;
       this.quantityUnit = quantityUnit;
    }
    public Fraction getQuantity() {
        return quantity;
    }
    public void setQuantity(Fraction quantity) {
        this.quantity = quantity;
    }
    public String getQuantityUnit() {
        return quantityUnit;
    }
    public void setQuantityUnit(String quantityUnit) {
        this.quantityUnit = quantityUnit;
    }

}
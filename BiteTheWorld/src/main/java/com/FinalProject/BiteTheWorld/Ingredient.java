package com.FinalProject.BiteTheWorld;

import java.util.List;

class Ingredient {
    private int id;
    protected String name;
    protected String image;
    protected String description;

    public List<Recipe> getAssociatedRecipes() {
        throw new UnsupportedOperationException();
    }
}
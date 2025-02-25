package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class ContentSystem {
    // private ArrayList<Recipe> recipes = new ArrayList<>();
    // private ArrayList<Ingredient> ingredients = new ArrayList<>();
    // private ArrayList<Report> reports = new ArrayList<>();
    private Map<String, CountryInfo> countries = new HashMap<>();
    private int featuredRecipeID;

    public void submitRecipe(Recipe recipe) {
    }

    public void submitReport(Report report) {
    }

    public void addIngredient(Ingredient ingredient) {
    }

    public void updateFeaturedRecipe() {
    }

    public CountryInfo getCountryInfo(String country, int limit) {
        throw new UnsupportedOperationException();
    }

    public Recipe getFeaturedRecipe() {
        throw new UnsupportedOperationException();
    }

    public Recipe getRecipeByID(int id) {
        throw new UnsupportedOperationException();
    }

    public Ingredient getIngredientByID(int id) {
        throw new UnsupportedOperationException();
    }

    public Report getReportByID(Integer id) {
        throw new UnsupportedOperationException();
    }

    public List<Recipe> recommendFromHistory(History history) {
        throw new UnsupportedOperationException();
    }

    public List<Recipe> recommendFromIngredients(Ingredient[] ingredients) {
        throw new UnsupportedOperationException();
    }
}
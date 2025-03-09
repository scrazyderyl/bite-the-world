package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class ContentSystem {
    // private ArrayList<Recipe> recipes = new ArrayList<>();
    // private ArrayList<Ingredient> ingredients = new ArrayList<>();
    // private ArrayList<Report> reports = new ArrayList<>();
    private List<Recipe> recipes = new ArrayList<>();
    private List<Ingredient> ingredients = new ArrayList<>();
    private List<Report> reports = new ArrayList<>();
    private Map<String, CountryInfo> countries = new HashMap<>();
    private int featuredRecipeID;
    private int currID;
    public void submitRecipe(Recipe recipe) {
        recipe.setId(currID++);
        recipes.add(recipe);
        updateFeaturedRecipe();
    }

    public void submitReport(Report report) {
        reports.add(report);
    }

    public void addIngredient(Ingredient ingredient) {
        ingredients.add(ingredient);
    }

    public void updateFeaturedRecipe() {
        
    }
    public boolean deleteById(int id){
        Recipe rem = getRecipeByID(id);
        if(rem != null){
            recipes.remove(id);
            return true;
        }
        return false;
    }
    public CountryInfo getCountryInfo(String country, int limit) {
        throw new UnsupportedOperationException();
    }

    public Recipe getFeaturedRecipe() {
        for (Recipe r : recipes){
            if(r.getId() ==featuredRecipeID){
                return r;
            }
           }
      return null;
    }

    public Recipe getRecipeByID(int id) {
        for (Recipe r : recipes){
            if(r.getId() ==id){
                return r;
            }
           }
      return null;
    }

    public Ingredient getIngredientByID(int id) {
        for (Ingredient i :ingredients){
            if(i.getId() ==id){
                return i;
            }
           }
      return null;
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
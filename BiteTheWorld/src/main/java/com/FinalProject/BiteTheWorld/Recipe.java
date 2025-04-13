package com.FinalProject.BiteTheWorld;

import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.google.cloud.firestore.annotation.DocumentId;

class Recipe {
    @DocumentId private String id;
    public String name;
    public String authorId;
    public Date lastUpdated;
    public List<String> tags;
    public List<Country> countries;
    public String description;
    public List<String> images;
    public int prepTime;
    public int cookTime;
    public int servings;
    public List<IngredientWithQuantity> ingredients;
    public List<String> directions;
    public String notes;
    public HashMap<String, Comment> comments;
    public long views;

    @JsonSerialize(using = RatingsSerializer.class)
    public Ratings ratings;
    
    public Recipe(String name, String authorId, List<String> tags, List<Country> countries, String description, List<String> images,
            int prepTime, int cookTime, int servings, List<IngredientWithQuantity> ingredients, List<String> directions,
            String notes) {
        this.name = name;
        this.authorId = authorId;
        this.lastUpdated = new Date();
        this.tags = tags;
        this.countries = countries;
        this.description = description;
        this.images = images;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.servings = servings;
        this.ingredients = ingredients;
        this.directions = directions;
        this.notes = notes;
        this.comments = new HashMap<>();
        this.views = 0;
        this.ratings = new Ratings();
    }

    public Recipe() {

    }

    public String getId() {
        return id;
    }

    public boolean containsIngredient(String ingredientToCheck) {
        for (IngredientWithQuantity ingredient : ingredients) {
            if (ingredient.name.equals(ingredientToCheck)) {
                return true;
            }
        }
        return false;
    }

    public RecipeOverview toListing() {
        String thumbnail = images.isEmpty() ? null : images.get(0);

        return new RecipeOverview(id, thumbnail, name, ratings.average(), servings, prepTime + cookTime);
    }
}
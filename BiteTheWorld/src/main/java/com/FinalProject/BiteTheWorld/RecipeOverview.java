package com.FinalProject.BiteTheWorld;

public class RecipeOverview {
    public String id;
    public String thumbnail;
    public String name;
    public double rating;
    public int servings;
    public int totalTime;

    public RecipeOverview() {
        
    }

    public RecipeOverview(String id, String thumbnail, String name, double rating, int servings, int totalTime) {
        this.id = id;
        this.thumbnail = thumbnail;
        this.name = name;
        this.rating = rating;
        this.servings = servings;
        this.totalTime = totalTime;
    }
}

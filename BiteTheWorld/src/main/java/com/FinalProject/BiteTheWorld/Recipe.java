package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

public class Recipe {
    private String id;
    private String name;
    private String authorId;
    private Date lastUpdated;
    private ArrayList<String> tags;
    private ArrayList<String> images;
    private ArrayList<String> countries;
    private String description;
    private ArrayList<IngredientWithQuantity> ingredients;
    private String directions;
    private String notes;
    private HashMap<String, Comment> comments;
    private long views;
    private Ratings ratings;
    
    public Recipe(String id, String name, String authorId, Date lastUpdated, ArrayList<String> tags, ArrayList<String> images,
            ArrayList<String> countries, String description, ArrayList<IngredientWithQuantity> ingredients, String directions,
            String notes, HashMap<String, Comment> comments, int views, Ratings rating) {
        this.id = id;
        this.name = name;
        this.authorId = authorId;
        this.lastUpdated = lastUpdated;
        this.tags = tags;
        this.images = images;
        this.countries = countries;
        this.description = description;
        this.ingredients = ingredients;
        this.directions = directions;
        this.notes = notes;
        this.comments = comments;
        this.views = views;
        this.ratings = rating;
    }

    public boolean addComment(String userId, String content) {
        return false;
    }

    public boolean editComment(int commentId, String content) {
        return false;
    }

    public boolean deleteComment(int commentId) {
        return false;
    }

    public String getId() {
        return id;
    }
    
    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public Date getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public ArrayList<String> getTags() {
        return tags;
    }

    public void setTags(ArrayList<String> tags) {
        this.tags = tags;
    }

    public ArrayList<String> getImages() {
        return images;
    }

    public void setImages(ArrayList<String> images) {
        this.images = images;
    }

    public ArrayList<String> getCountries() {
        return countries;
    }

    public void setCountries(ArrayList<String> countries) {
        this.countries = countries;
    }

    public String getDirections() {
        return directions;
    }

    public void setDirections(String directions) {
        this.directions = directions;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public HashMap<String, Comment> getComments() {
        return comments;
    }

    public void setComments(HashMap<String, Comment> comments) {
        this.comments = comments;
    }

    public long getViews() {
        return views;
    }

    public void setViews(long views) {
        this.views = views;
    }

    public Ratings getRatings() {
        return ratings;
    }

    public void setRatings(Ratings rating) {
        this.ratings = rating;
    }

    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public ArrayList<IngredientWithQuantity> getIngredients() {
        return ingredients;
    }
    
    public void setIngredients(ArrayList<IngredientWithQuantity> ingredients) {
        this.ingredients = ingredients;
    }
}
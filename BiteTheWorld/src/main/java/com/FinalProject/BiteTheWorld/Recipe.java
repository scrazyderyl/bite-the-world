package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

public class Recipe {
    private int id;
    
    protected String name;
    protected int authorId;
    protected Date lastUpdated;
    protected List<String> tags;
    protected List<String> images;
    protected List<String> countries;
    protected String description;
    protected List<IngredientWithQuantity> ingredients;
    protected String directions;
    protected String notes;
    protected HashMap<Integer, Comment> comments;
    protected int views;
    protected Ratings rating;
    
    // Internal counter for comment IDs
   // private int nextCommentId;

  
    public Recipe(int id, String name, String description, List<IngredientWithQuantity> ingredients) {
        //set baseline variables
        this.id = id;
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        
        // Initialize lists 
        this.tags = new ArrayList<>();
        this.images = new ArrayList<>();
        this.countries = new ArrayList<>();
        this.comments = new HashMap<>();
        
        this.lastUpdated = new Date();
        this.views = 0;
        // this.nextCommentId = 1;
        // authorId, directions, notes, and rating can be set via setters or additional constructors.
    }
    
    // // Method to add a comment.
    // public boolean addComment(UUID userId, String content) {
    //     if (content == null || content.trim().isEmpty()) {
    //         return false;
    //     }
    //     int commentId = nextCommentId++;
    //     Comment newComment = new Comment(commentId, userId, content);
    //     comments.put(commentId, newComment);
    //     lastUpdated = new Date();
    //     return true;
    // }

    // // Method to edit an existing comment.
    // public boolean editComment(int commentId, String content) {
    //     Comment comment = comments.get(commentId);
    //     if (comment != null && content != null && !content.trim().isEmpty()) {
    //         comment.setContent(content);
    //         comment.setTimestamp(new Date());
    //         lastUpdated = new Date();
    //         return true;
    //     }
    //     return false;
    // }

    // // Method to delete a comment.
    // public boolean deleteComment(int commentId) {
    //     if (comments.containsKey(commentId)) {
    //         comments.remove(commentId);
    //         lastUpdated = new Date();
    //         return true;
    //     }
    //     return false;
    // }
    public int getId() {
        return id;
    }
    
    public int getAuthorId() {
        return authorId;
    }

    public void setAuthorId(int authorId) {
        this.authorId = authorId;
    }

    public Date getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(Date lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public List<String> getCountries() {
        return countries;
    }

    public void setCountries(List<String> countries) {
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

    public HashMap<Integer, Comment> getComments() {
        return comments;
    }

    public void setComments(HashMap<Integer, Comment> comments) {
        this.comments = comments;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }

    public Ratings getRating() {
        return rating;
    }

    public void setRating(Ratings rating) {
        this.rating = rating;
    }

    public void setId(int id) {
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
    
    public List<IngredientWithQuantity> getIngredients() {
        return ingredients;
    }
    
    public void setIngredients(List<IngredientWithQuantity> ingredients) {
        this.ingredients = ingredients;
    }
}
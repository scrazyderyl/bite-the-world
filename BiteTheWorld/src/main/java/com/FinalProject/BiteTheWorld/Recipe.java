package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import com.google.cloud.firestore.annotation.DocumentId;

public class Recipe {
    @DocumentId private String id;
    public String name;
    public String authorId;
    public Date lastUpdated;
    public ArrayList<String> tags;
    public ArrayList<String> images;
    public ArrayList<String> countries;
    public String description;
    public ArrayList<IngredientWithQuantity> ingredients;
    public String directions;
    public String notes;
    public HashMap<String, Comment> comments;
    public long views;
    public Ratings ratings;
    
    public Recipe() {

    }

    public String getId() {
        return id;
    }
}
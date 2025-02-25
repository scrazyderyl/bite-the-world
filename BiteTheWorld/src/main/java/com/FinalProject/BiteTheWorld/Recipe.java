package main.java.com.FinalProject.BiteTheWorld;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

class Recipe {
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

    public boolean addComment(UUID userId, String content) {
        throw new UnsupportedOperationException();
    }

    public boolean editComment(int commentId, String content) {
        throw new UnsupportedOperationException();
    }

    public boolean deleteComment(int commentId) {
        throw new UnsupportedOperationException();
    }
}
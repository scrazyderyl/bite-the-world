package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.List;

public class History {
    public List<String> postViews;

    public History() {
        this.postViews = new ArrayList<>();
    }

    public List<String> getPostViews() {
        return postViews;
    }

    public void setPostViews(List<String> postViews) {
        this.postViews = postViews;
    }

    public void addView(String recipeId) {
        if (recipeId == null || recipeId.isEmpty()) return;

       
        if (!postViews.contains(recipeId)) {
            postViews.add(recipeId);
            if (postViews.size() > 20) {
                postViews.remove(0); 
            }
        }
    }

    public boolean hasViewed(String recipeId) {
        return postViews.contains(recipeId);
    }

    public void clearHistory() {
        postViews.clear();
    }

    public int size() {
        return postViews.size();
    }
}

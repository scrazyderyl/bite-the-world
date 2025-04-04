package com.FinalProject.BiteTheWorld;

import java.util.HashMap;

class Ratings {
    public HashMap<String, Integer> ratings;
    public int sum;

    public Ratings() {
        this.ratings = new HashMap<>();
    }

    public double average() {
        if (ratings.isEmpty()) {
            return 0;
        }
        
        return (double) sum / ratings.size();
    }

    public int count() {
        return ratings.size();
    }

    public void setRating(String userId, int rating) {
        Integer previous = ratings.put(userId, rating);

        // Remove previous rating first if it exists
        if (previous != null) {
            sum -= previous;
        }

        sum += rating;
    }

    public Integer getUserRating(String userId) {
        return ratings.get(userId);
    }
}
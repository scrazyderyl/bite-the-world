package main.java.com.FinalProject.BiteTheWorld;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

class Ratings {
    protected Map<UUID, Integer> ratings = new HashMap<>();
    protected int sum;

    public float average() {
        throw new UnsupportedOperationException();
    }

    public void setRating(UUID id, int rating) {
    }
}
package com.FinalProject.BiteTheWorld;

import com.google.cloud.firestore.annotation.DocumentId;

class Ingredient {
    @DocumentId private String id;
    public String name;
    public String authorID;
    public String image;
    public String description;

    public Ingredient() {

    }

    public Ingredient(String name, String authorID, String image, String description) {
        this.name = name;
        this.authorID = authorID;
        this.image = image;
        this.description = description;
    }

    public String getId() {
        return id;
    }
}
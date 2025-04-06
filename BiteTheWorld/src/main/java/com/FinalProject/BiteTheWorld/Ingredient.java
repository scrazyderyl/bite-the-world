package com.FinalProject.BiteTheWorld;

import com.google.cloud.firestore.annotation.DocumentId;

class Ingredient {
    @DocumentId private String id;
    public String name;
    public String authorID;
    public String image;
    public String description;
    public int quantity;
    public String unit;

    public Ingredient() {

    }

    public Ingredient(String name, String authorID, String image, String description,int quantity,String unit) {
        this.name = name;
        this.authorID = authorID;
        this.image = image;
        this.description = description;
        this.quantity = quantity;
        this.unit = unit;
    }

    public String getId() {
        return id;
    }
}
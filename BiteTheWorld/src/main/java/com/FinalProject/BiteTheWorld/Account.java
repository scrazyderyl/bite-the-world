package com.FinalProject.BiteTheWorld;

import java.util.List;

import com.google.cloud.firestore.annotation.DocumentId;

class Account {

    enum AccountType {
        Admin, Moderator, Standard;
    }

    @DocumentId private String id;
    public AccountType type;
    public History history;
    public Preferences preferences;

    public Account() {

    }

    public Account(AccountType type) {
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public List<Recipe> generateRecommendations() {
        throw new UnsupportedOperationException();
    }
}
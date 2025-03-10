package com.FinalProject.BiteTheWorld;

import java.util.Date;
import java.util.List;

class Account {
    enum AccountType {
        Admin, Moderator, Standard;
    }

    private int id;
    private Date created;
    protected AccountType type;
    protected String name;
    protected String email;
    protected History history;
    protected Preferences preferences;

    public Account(int id, Date created, AccountType type, String name, String email, History history,
            Preferences preferences) {
        this.id = id;
        this.created = created;
        this.type = type;
        this.name = name;
        this.email = email;
        this.history = history;
        this.preferences = preferences;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public AccountType getType() {
        return type;
    }

    public void setType(AccountType type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public History getHistory() {
        return history;
    }

    public void setHistory(History history) {
        this.history = history;
    }

    public Preferences getPreferences() {
        return preferences;
    }

    public void setPreferences(Preferences preferences) {
        this.preferences = preferences;
    }

    public List<Recipe> getRecommendations() {
        throw new UnsupportedOperationException();
    }
}
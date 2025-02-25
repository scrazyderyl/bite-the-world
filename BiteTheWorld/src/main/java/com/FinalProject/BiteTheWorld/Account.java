package main.java.com.FinalProject.BiteTheWorld;

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

    public List<Recipe> getRecommendations() {
        throw new UnsupportedOperationException();
    }
}
package com.FinalProject.BiteTheWorld;

import java.util.List;

class History {
    private List<String> postViews;

    public History(List<String> postViews) {
        this.postViews = postViews;
    }

    public void addPostID(String id) {

    }

    public List<String> getPostViews() {
        return postViews;
    }

    public void setPostViews(List<String> postViews) {
        this.postViews = postViews;
    }
}
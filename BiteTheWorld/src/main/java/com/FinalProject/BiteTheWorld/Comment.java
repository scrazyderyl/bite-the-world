package com.FinalProject.BiteTheWorld;

import java.util.Date;

class Comment {
    private int id;
    protected int authorId;
    protected Date postDate;
    protected String content;
    
    public Comment(int id, int authorId, Date postDate, String content) {
        this.id = id;
        this.authorId = authorId;
        this.postDate = postDate;
        this.content = content;
    }
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getAuthorId() {
        return authorId;
    }

    public void setAuthorId(int authorId) {
        this.authorId = authorId;
    }

    public Date getPostDate() {
        return postDate;
    }

    public void setPostDate(Date postDate) {
        this.postDate = postDate;
    }

    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
}
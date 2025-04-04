package com.FinalProject.BiteTheWorld;

import java.util.Date;

import com.google.cloud.firestore.annotation.DocumentId;

class Comment {
    @DocumentId private int id;
    public int authorId;
    public Date postDate;
    public String content;
    
    public Comment() {

    }
    
    public int getId() {
        return id;
    }
}
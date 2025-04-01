package com.FinalProject.BiteTheWorld;

import com.google.cloud.firestore.annotation.DocumentId;

class Report {
    enum ReportStatus {
        Open, UnderReview, Closed;
    }

    enum PostType {
        Recipe, Ingredient, Comment
    }

    @DocumentId private String id;
    public String reporterId;
    public String postId;
    public PostType postType;
    public String reason;
    public String description;
    public ReportStatus status;
    public String assigneeId;
    
    public Report() {
        
    }

    public Report(String reporterId, String postId, PostType postType, String reason, String description) {
        this.reporterId = reporterId;
        this.postId = postId;
        this.postType = postType;
        this.reason = reason;
        this.description = description;
        this.status = ReportStatus.Open;
    }

    public String getId() {
        return id;
    }
}
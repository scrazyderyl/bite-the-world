package com.FinalProject.BiteTheWorld;

class Report {
    enum ReportStatus {
        Open, UnderReview, Closed;
    }

    enum PostType {
        Recipe, Ingredient, Comment
    }

    private String id;
    private String reporterId;
    private int postId;
    private PostType postType;
    private String reason;
    private String description;
    protected ReportStatus status;
    protected String assigneeId;
    
    public Report(String id, String reporterId, int postId, PostType postType, String reason, String description,
            ReportStatus status, String assigneeId) {
        this.id = id;
        this.reporterId = reporterId;
        this.postId = postId;
        this.postType = postType;
        this.reason = reason;
        this.description = description;
        this.status = status;
        this.assigneeId = assigneeId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getReporterId() {
        return reporterId;
    }

    public int getPostId() {
        return postId;
    }

    public PostType getPostType() {
        return postType;
    }

    public String getReason() {
        return reason;
    }

    public String getDescription() {
        return description;
    }

    public ReportStatus getStatus() {
        return status;
    }

    public void setStatus(ReportStatus status) {
        this.status = status;
    }

    public String getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(String assigneeId) {
        this.assigneeId = assigneeId;
    }
}
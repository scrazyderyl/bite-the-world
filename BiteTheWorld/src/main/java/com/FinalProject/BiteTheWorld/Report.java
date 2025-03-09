package com.FinalProject.BiteTheWorld;

import java.util.UUID;

class Report {
    enum ReportStatus {
        Open, UnderReview, Closed;
    }

    private final int id;
    private final int postId;
    private final int commentId;
    private final String reason;
    private final String description;
    protected ReportStatus status;
    protected UUID assignee;
    public Report(final int id, final int postId, final int commentId, final String reason, final String description){
        this.id = id;
        this.postId = postId;
        this.commentId = commentId;
        this.reason = reason;
        this.description = description;
    }
    public int getPostID() {
        throw new UnsupportedOperationException();
    }

    public int getCommentID() {
        throw new UnsupportedOperationException();
    }

    public String getReason() {
        throw new UnsupportedOperationException();
    }

    public String getDescription() {
        throw new UnsupportedOperationException();
    }
    public int getId() {
        return id;
    }
    public int getPostId() {
        return postId;
    }
    public int getCommentId() {
        return commentId;
    }
    public ReportStatus getStatus() {
        return status;
    }
    public void setStatus(ReportStatus status) {
        this.status = status;
    }
    public UUID getAssignee() {
        return assignee;
    }
    public void setAssignee(UUID assignee) {
        this.assignee = assignee;
    }
}
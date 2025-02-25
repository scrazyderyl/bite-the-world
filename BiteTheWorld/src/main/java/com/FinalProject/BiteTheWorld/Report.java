package main.java.com.FinalProject.BiteTheWorld;

import java.util.UUID;

class Report {
    enum ReportStatus {
        Open, UnderReview, Closed;
    }

    private int id;
    private int postId;
    private int commentId;
    private String reason;
    private String description;
    protected ReportStatus status;
    protected UUID assignee;

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
}
package com.FinalProject.BiteTheWorld;

import com.FinalProject.BiteTheWorld.Report.PostType;
import com.google.firebase.auth.FirebaseAuthException;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

class ReportSubmission {
    public String idToken;

    @NotNull
    public String postId;

    @NotNull
    public PostType postType;

    @NotBlank
    public String reason;
    
    public String description;

    public ReportSubmission() {

    }

    public Report toReport() throws FirebaseAuthException {
        String reporterId = FirebaseConnection.getUID(idToken);
        
        return new Report(reporterId, postId, postType, reason, description);
    }
}

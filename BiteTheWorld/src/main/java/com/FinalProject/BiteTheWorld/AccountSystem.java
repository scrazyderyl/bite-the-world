package com.FinalProject.BiteTheWorld;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;

class AccountSystem {
    private FirebaseAuth auth;

    public AccountSystem() {
        auth = FirebaseConnection.getAuth();
    }

    public String login(String idToken) {
        try {
            FirebaseToken decodedToken = auth.verifyIdToken(idToken);
            return decodedToken.getUid(); // Return Firebase user ID if valid
        } catch (FirebaseAuthException e) {
            System.err.println("Invalid login token: " + e.getMessage());
            return null; // Return null if authentication fails
        }
    }

    public boolean register(String name, String email, String password) {
        try {
            UserRecord.CreateRequest request = new UserRecord.CreateRequest().setEmail(email).setPassword(password)
                    .setDisplayName(name);
            auth.createUser(request);
        } catch (Exception e) {
            return false;
        }

        return true;
    }

    public boolean requestPasswordReset(String email) {
        try {
            auth.generatePasswordResetLink(email);
        } catch (Exception e) {
            return false;
        }

        return true;
    }

    public boolean changeEmail(String userId, String newEmail) {
        try {
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(userId).setEmail(newEmail);
            auth.updateUser(request);
        } catch (Exception e) {
            return false;
        }

        return true;
    }

    public boolean deleteAccount(String userId) {
        try {
            auth.deleteUser(userId);
        } catch (Exception e) {
            return false;
        }

        return true;
    }
}
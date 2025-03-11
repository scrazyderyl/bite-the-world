package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.UserRecord;

class AccountSystem {
    private List<Account> accounts = new ArrayList<>();
    private FirebaseAuth auth;
    public AccountSystem(){
        auth = FirebaseConnection.getAuth();
    }
    //Login with firebase has to be done on the frontend not the backend
    public UUID login(String email, String password) {
        
        throw new UnsupportedOperationException();
    }

    public boolean register(String name, String email, String password) {
        try {
            UserRecord.CreateRequest request = new UserRecord.CreateRequest().setEmail(email).setPassword(password).setDisplayName(name);
            UserRecord userRecord = auth.createUser(request);
            return userRecord != null;
        } catch (Exception e) {
            return false;
            
        }
       
    }

    public boolean requestPasswordReset(String email) {
        try {
            auth.generatePasswordResetLink(email);
            return true;
        } catch (Exception e) {
            return false;
            // TODO: handle exception
        }
        
    }

    

    public boolean changeEmail(String userId, String newEmail) {
        try {
            UserRecord.UpdateRequest request = new UserRecord.UpdateRequest(userId).setPassword(newEmail);
            auth.updateUser(request);
            return true;
        } catch (Exception e) {
            return false;
            // TODO: handle exception
        }
        
    }

    public boolean deleteAccount(String userId) {
        try {
            
            auth.deleteUser(userId);
            return true;
        } catch (Exception e) {
            return false;
            // TODO: handle exception
        }

    }
}
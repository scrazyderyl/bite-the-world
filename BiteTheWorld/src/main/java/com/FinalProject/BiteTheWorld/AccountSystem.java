package com.FinalProject.BiteTheWorld;

import com.FinalProject.BiteTheWorld.Account.AccountType;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.FieldValue;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.google.firebase.auth.UserRecord.CreateRequest;

class AccountSystem {
    private static AccountSystem instance;

    private FirebaseAuth auth;
    private Firestore db;

    static {
        instance = new AccountSystem();
    }

    public AccountSystem() {
        auth = FirebaseConnection.getAuth();
        db = FirebaseConnection.getDatabase();
    }

    public static AccountSystem getInstance() {
        return instance;
    }

    // For admin use only
    public boolean createAccount(String name, String email, String password, AccountType accountType) {
        try {
            CreateRequest request = new UserRecord.CreateRequest().setEmail(email).setPassword(password).setDisplayName(name);
            UserRecord user = auth.createUser(request);

            DocumentReference ref = db.collection("accounts").document(user.getUid());
            ref.set(new Account(accountType));
            ref.get().get();
        } catch (Exception e) {
            return false;
        }

        return true;
    }

    public String getUID(String idToken) throws FirebaseAuthException {
        String uid = auth.verifyIdToken(idToken).getUid();

        // Create a document for the user if it doesn't exist
        try {
            DocumentReference ref = db.collection("accounts").document(uid);
            DocumentSnapshot snapshot = ref.get().get();

            if (!snapshot.exists()) {
                ref.set(new Account(AccountType.Standard)).get();
            }
        } catch (Exception e) {
            return null;
        }

        return uid;
    }

    public void addToHistory(String userId, String recipeId) {
        try {
            DocumentReference ref = db.collection("accounts").document(userId);
            ref.update("history.postViews", FieldValue.arrayUnion(recipeId)).get();
        } catch (Exception e) {
            
        }
    }

    public void setPreferences(String userId, String key, Object value) {
        try {
            DocumentReference ref = db.collection("accounts").document(userId);
            ref.update("preferences." + key, value).get();
        } catch (Exception e) {
            
        }
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
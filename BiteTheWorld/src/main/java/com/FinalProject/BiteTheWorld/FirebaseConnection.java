package com.FinalProject.BiteTheWorld;

import java.io.FileInputStream;
import java.util.HashMap;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;

class FirebaseConnection {
    private FirebaseAuth auth;
    private Firestore db;

    public FirebaseConnection() throws Exception {
        ServiceAccountCredentials credentials = ServiceAccountCredentials.fromStream(new FileInputStream("src\\main\\resources\\api_key.json"));
        FirebaseOptions options = FirebaseOptions.builder()
        .setCredentials(credentials)
        .setDatabaseUrl("https://Bite-the-World.firebaseio.com")
        .build();
    
        FirebaseApp app = FirebaseApp.initializeApp(options);
        auth = FirebaseAuth.getInstance(app);
        db = FirestoreClient.getFirestore(app);
    }
}

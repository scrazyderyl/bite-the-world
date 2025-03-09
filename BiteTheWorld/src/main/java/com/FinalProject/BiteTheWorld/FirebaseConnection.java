package com.FinalProject.BiteTheWorld;

import java.io.FileInputStream;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.cloud.FirestoreClient;

public class FirebaseConnection {
    private static FirebaseAuth auth;
    private static Firestore db;

    static {
        try {
            FileInputStream serviceAccount = new FileInputStream("src/main/resources/api_key.json");
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(ServiceAccountCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://Bite-the-World.firebaseio.com")
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

            auth = FirebaseAuth.getInstance();
            db = FirestoreClient.getFirestore();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static Firestore getDatabase() {
        return db;
    }

    public static FirebaseAuth getAuth() {
        return auth;
    }
}

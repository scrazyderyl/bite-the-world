package com.FinalProject.BiteTheWorld;

import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;

@Service
class ContentSystem {
    private static ContentSystem instance;

    private final Firestore db;
    private HashMap<String, CountryInfo> countries = new HashMap<>() {{
        put("USA", new CountryInfo() {{
            name = "United States of America";
            summary = "The USA is known for its diverse cuisine, influenced by various cultures and regions. From burgers and hot dogs to barbecue and soul food, American cuisine offers a wide range of flavors and dishes.";
        }});
    }};
    private Recipe featuredRecipe;

    static {
        instance = new ContentSystem();
    }
    
    private ContentSystem() {
        db = FirebaseConnection.getDatabase();
    }

    public static ContentSystem getInstance() {
        return instance;
    }

    public <T> String submit(String collection, T document) {
        DocumentReference ref = db.collection(collection).document();
        ApiFuture<WriteResult> result = ref.set(document);

        try {
            result.get();
            return ref.getId();
        } catch (InterruptedException | ExecutionException e) {
            return null;
        }
    }

    public DocumentSnapshot getDocument(String collection, String id) throws InterruptedException, ExecutionException {
        ApiFuture<DocumentSnapshot> request = db.collection(collection).document(id).get();

        return request.get();
    }

    public boolean deleteById(String collection, String id) {
        ApiFuture<WriteResult> result = db.collection(collection).document(id).delete();

        try {
            result.get();
            return true;
        } catch (InterruptedException | ExecutionException e) {
            return false;
        }        
    }

    public List<Recipe> getRecipesByCountry(String country) {
        ApiFuture<QuerySnapshot> request = db.collection("recipes").whereArrayContains("countries", country).get();
        
        try {
            return request.get().toObjects(Recipe.class);
        } catch (InterruptedException | ExecutionException e) {
            return null;
        }
    }

    public CountryInfo getCountryInfo(String country) {
        return countries.get(country);
    }

    public void updateFeaturedRecipe() {
        throw new UnsupportedOperationException();
    }
    
    public Recipe getFeaturedRecipe() {
        return featuredRecipe;
    }

    public List<Recipe> recommendFromHistory(History history) {
        throw new UnsupportedOperationException();
    }

    public List<Recipe> recommendFromIngredients(Ingredient[] ingredients) {
        throw new UnsupportedOperationException();
    }
}
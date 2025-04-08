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
    private HashMap<String, CountryInfo> countries;
    private Recipe featuredRecipe;

    static {
        instance = new ContentSystem();
    }
    
    private ContentSystem() {
        db = FirebaseConnection.getDatabase();
        countries = new HashMap<>();
    
        try {
            ApiFuture<QuerySnapshot> request = db.collection("countries").get();
            List<CountryInfo> countryList = request.get().toObjects(CountryInfo.class);
    
            for (CountryInfo country : countryList) {
                countries.put(country.name, country);
            }
        } catch (Exception e) {
            
            for (Country country : Country.values()) {
                CountryInfo countryInfo = new CountryInfo();
                countryInfo.name = country.name;
                countryInfo.summary = "Summary not available";
                countries.put(country.name, countryInfo);
            }
        }
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
        CountryInfo info = countries.get(country);
    
        if (info != null && "Summary not available".equals(info.summary)) {
            List<Recipe> recipes = getRecipesByCountry(country);
            if (recipes != null && !recipes.isEmpty()) {
                String summary = GeminiIntegration.generateCountrySummary(recipes);
                if (summary != null) {
                    info.summary = summary.trim();
                    db.collection("countries").document(country).set(info);
                }
            }
        }
    
        return info;
    }
    public void updateRecipeViews(String recipeId, long views) {
    db.collection("recipes").document(recipeId).update("views", views);
    }

    public void updateFeaturedRecipe() {
        try {
            // this will order the recipes by the amount of views they have
            ApiFuture<QuerySnapshot> request = db.collection("recipes")
                .orderBy("views", com.google.cloud.firestore.Query.Direction.DESCENDING)
                .limit(1)
                .get();
    
            List<Recipe> topRecipes = request.get().toObjects(Recipe.class);
    
            if (!topRecipes.isEmpty()) {
                featuredRecipe = topRecipes.get(0);
            }
        } catch (InterruptedException | ExecutionException e) {
            System.out.println("Failed to update featured recipe: " + e.getMessage());
        }
    }
    
    public Recipe getFeaturedRecipe() {
        return featuredRecipe;
    }

    public List<Recipe> recommendFromHistory(History history) {
        try {
            // Fetch all recipes from Firestore
            ApiFuture<QuerySnapshot> request = db.collection("recipes").get();
            List<Recipe> allRecipes = request.get().toObjects(Recipe.class);
    
            // Call Gemini to generate recommendations
            String json = GeminiIntegration.generateRecommendations(allRecipes, history.postViews);
    
            // Parse and return the recommended recipes
            return GeminiIntegration.parseRecommendations(json);
        } catch (Exception e) {
            System.out.println("Error in recommendFromHistory: " + e.getMessage());
            return List.of(); 
        }
    }
    

    public List<Recipe> recommendFromIngredients(Ingredient[] ingredients) {

        if (ingredients == null || ingredients.length == 0) {
            return List.of(); 
        }
        try {
            HashMap<String, Integer> ingredientFrequency = new HashMap<>();

            for (Ingredient ingredient : ingredients) {
                String ingredientName = ingredient.name;
                if (ingredientFrequency.containsKey(ingredientName)) {
                    int count = ingredientFrequency.get(ingredientName);
                    ingredientFrequency.put(ingredientName, count + 1);
                } else {
                    ingredientFrequency.put(ingredientName, 1);
                }
            }

        
            String topIngredient = null;
            int maxCount = 0;

            for (String ingredient : ingredientFrequency.keySet()) {
                int count = ingredientFrequency.get(ingredient);
                if (count > maxCount) {
                    maxCount = count;
                    topIngredient = ingredient;
                }
            }

            if (topIngredient != null) {
                return getRecipesByCountry(topIngredient);
            }

        } catch (Exception e) {
            System.out.println("Error in recommendFromIngredients: " + e.getMessage());
        }
        return List.of(); 
    }

}
package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.springframework.stereotype.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.CollectionReference;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.QuerySnapshot;
import com.google.cloud.firestore.WriteResult;
import com.google.gson.Gson;

import me.xdrop.fuzzywuzzy.FuzzySearch;
import me.xdrop.fuzzywuzzy.model.BoundExtractedResult;

@Service
class ContentSystem {
    private static ContentSystem instance;

    private final Firestore db;

    // Caches
    private Recipe featuredRecipe;
    private HashMap<String, CountryInfo> countries;
    protected HashMap<String, Ingredient> ingredients;

    static {
        instance = new ContentSystem();
    }

    private ContentSystem() {
        db = FirebaseConnection.getDatabase();

        try {
            ApiFuture<QuerySnapshot> request = db.collection("countries").get();
            List<CountryInfo> countryList = request.get().toObjects(CountryInfo.class);
            countries = new HashMap<>();

            for (CountryInfo country : countryList) {
                countries.put(country.id, country);
            }

            List<Ingredient> allIngredients = db.collection("ingredients").get().get().toObjects(Ingredient.class);
            ingredients = new HashMap<>();

            for (Ingredient ingredient : allIngredients) {
                ingredients.put(ingredient.getId(), ingredient);
            }
        } catch (Exception e) {
            System.out.println("Failed to fetch data from Firebase");
        }
    }

    public static ContentSystem getInstance() {
        return instance;
    }

    public Recipe getRecipeByIngredient(String[] ingredients) {
        try {
            CollectionReference doc = db.collection("recipes");
            List<Recipe> recipeList = doc.whereArrayContainsAny("ingredientsstrings", Arrays.asList(ingredients)).get()
                    .get().toObjects(Recipe.class);
            if (recipeList.get(0) == null) {
                return null; // No recipes found with the given ingredients
            }
            for (String ingredient : ingredients) {
                for (Recipe recipe : recipeList) {
                    if (recipeList.size() == 1) {
                        return recipeList.get(0);
                    }
                    if (!recipe.containsIngredient(ingredient)) {
                        recipeList.remove(recipe);
                    }
                }
            }
            return recipeList.get(0); // Return the first recipe that matches all ingredients
            // return doc.toObject(Recipe.class);
        } catch (InterruptedException | ExecutionException e) {
            System.out.println("Error fetching recipe: " + e.getMessage());
            return null;
        }
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

    public boolean userCanEdit(String collection, String documentId, String userId)
            throws InterruptedException, ExecutionException {
        ApiFuture<DocumentSnapshot> request = db.collection(collection).document(documentId).get();
        String authorId = request.get().getString("authorId");

        return userId.equals(authorId);
    }

    public boolean editById(String collection, String id, HashMap<String, Object> newValues) {
        ApiFuture<WriteResult> result = db.collection(collection).document(id).update(newValues);

        try {
            result.get();
            return true;
        } catch (InterruptedException | ExecutionException e) {
            return false;
        }
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

    public void updateRecipeViews(String recipeId, long views) {
        db.collection("recipes").document(recipeId).update("views", views);
    }

    public List<Ingredient> lookupIngredientsByName(String name, int limit) {
        List<BoundExtractedResult<Ingredient>> results = FuzzySearch.extractTop(name, ingredients.values(),
                ingredient -> ingredient.name, limit, 70);

        List<Ingredient> output = new ArrayList<>(results.size());

        for (BoundExtractedResult<Ingredient> ingredient : results) {
            output.add(ingredient.getReferent());
        }

        return output;
    }

    public List<Recipe> getRecipesByCountry(String country_code, int limit) {
        ApiFuture<QuerySnapshot> request = db.collection("recipes").whereArrayContains("countries", country_code)
                .limit(limit).get();

        try {
            return request.get().toObjects(Recipe.class);
        } catch (InterruptedException | ExecutionException e) {
            return null;
        }
    }

    public CountryInfo getCountryInfo(String country_code) {
        return countries.get(country_code);
    }

    public void updateCountrySummary(String country_code) {
        List<Recipe> recipes = getRecipesByCountry(country_code, 20);

        if (recipes == null || recipes.isEmpty()) {
            return;
        }

        String summary = GeminiIntegration.generateCountrySummary(recipes);

        // Update cache
        CountryInfo countryInfo = countries.get(country_code);
        countryInfo.summary = summary;

        // Update database
        db.collection("countries").document(country_code).update("summary", summary);
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

    public List<Recipe> recommendFromHistory(String userId) {
        try {
            // Fetch all recipes from Firestore

            Account account =
            db.collection("accounts").document(userId).get().get().toObject(Account.class);
            History history = account.history;

            if (history == null || history.postViews == null || history.postViews.isEmpty()) {
                System.err.println("No history available for user: " + userId);
                return List.of(); // No history available
            }
            CollectionReference doc = db.collection("recipes");
            List<Recipe> allRecipes = doc.get().get().toObjects(Recipe.class);
            System.out.println("All recipes: " + allRecipes.size());
            System.out.println("History post views: " + history.postViews.size());
            // Call Gemini to generate recommendations
            String json = GeminiIntegration.generateRecommendations(allRecipes, history.postViews);

            System.out.println("Recommendations JSON: " + json);
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
                return getRecipesByCountry(topIngredient, 100);
            }

        } catch (Exception e) {
            System.out.println("Error in recommendFromIngredients: " + e.getMessage());
        }
        return List.of();
    }

}
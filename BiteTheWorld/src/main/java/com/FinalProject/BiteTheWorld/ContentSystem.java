package com.FinalProject.BiteTheWorld;

import java.util.HashMap;
import java.util.List;
import java.util.concurrent.ExecutionException;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import org.springframework.stereotype.Service;

@Service
class ContentSystem {
    private final Firestore db;
    private HashMap<String, CountryInfo> countries;
    private Recipe featuredRecipe;

    public ContentSystem() {
        db = FirebaseConnection.getDatabase();
    }

    public void submitRecipe(Recipe recipe) {
        DocumentReference ref = db.collection("recipes").document();
        recipe.setId(ref.getId());
        ApiFuture<com.google.cloud.firestore.WriteResult> result = ref.set(recipe);

        try {
            System.out.println("Recipe uploaded at: " + result.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            System.err.println("Error uploading recipe: " + e.getMessage());
        }
    }

    public void submitReport(Report report) {
        DocumentReference ref = db.collection("reports").document();
        report.setId(ref.getId());
        ApiFuture<com.google.cloud.firestore.WriteResult> result = ref.set(report);

        try {
            System.out.println("Report uploaded at: " + result.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            System.err.println("Error uploading report: " + e.getMessage());
        }
    }

    public void addIngredient(Ingredient ingredient) {
        DocumentReference ref = db.collection("ingredients").document();
        ingredient.setId(ref.getId());
        ApiFuture<com.google.cloud.firestore.WriteResult> result = ref.set(ingredient);

        try {
            System.out.println("Ingredient uploaded at: " + result.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            System.err.println("Error uploading ingredient: " + e.getMessage());
        }
    }

    public void updateFeaturedRecipe() {
        throw new UnsupportedOperationException();
    }

    public boolean deleteById(int id) {
        throw new UnsupportedOperationException();
    }

    public CountryInfo getCountryInfo(String country, int limit) {
        throw new UnsupportedOperationException();
    }
    
    public Recipe getFeaturedRecipe() {
        return null;
    }

    public Recipe getRecipeByID(String id) {
        ApiFuture<DocumentSnapshot> request = db.collection("recipes").document(id).get();

        try {
            DocumentSnapshot document = request.get();

            if (document.exists()) {
                Recipe recipe = document.toObject(Recipe.class);
                return recipe;
            } else {
                System.out.println("Recipe with ID " + id + " not found in Firestore.");
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            System.err.println("Error retrieving recipe: " + e.getMessage());
            return null;
        }
    }

    public Ingredient getIngredientByID(String id) {
        ApiFuture<DocumentSnapshot> request = db.collection("ingredients").document(id).get();

        try {
            DocumentSnapshot document = request.get();

            if (document.exists()) {
                Ingredient ingredient = document.toObject(Ingredient.class);
                return ingredient;
            } else {
                System.out.println("Recipe with ID " + id + " not found in Firestore.");
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            System.err.println("Error retrieving recipe: " + e.getMessage());
            return null;
        }
    }

    public Report getReportByID(String id) {
        ApiFuture<DocumentSnapshot> request = db.collection("reports").document(id).get();

        try {
            DocumentSnapshot document = request.get();

            if (document.exists()) {
                Report report = document.toObject(Report.class);
                return report;
            } else {
                System.out.println("Report with ID " + id + " not found in Firestore.");
                return null;
            }
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            System.err.println("Error retrieving report: " + e.getMessage());
            return null;
        }
    }

    public List<Recipe> recommendFromHistory(History history) {
        throw new UnsupportedOperationException();
    }

    public List<Recipe> recommendFromIngredients(Ingredient[] ingredients) {
        throw new UnsupportedOperationException();
    }
}
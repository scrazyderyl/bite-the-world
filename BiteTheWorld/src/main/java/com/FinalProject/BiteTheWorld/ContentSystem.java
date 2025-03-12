package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.firestore.v1.WriteResult;
import org.springframework.stereotype.Service;

@Service
class ContentSystem {
    // private ArrayList<Recipe> recipes = new ArrayList<>();
    // private ArrayList<Ingredient> ingredients = new ArrayList<>();
    // private ArrayList<Report> reports = new ArrayList<>();
    private List<Recipe> recipes = new ArrayList<>();
    private List<Ingredient> ingredients = new ArrayList<>();
    private List<Report> reports = new ArrayList<>();
    private Map<String, CountryInfo> countries = new HashMap<>();
    private int featuredRecipeID;
    private final Firestore db;
    private int currID;

    public ContentSystem() {
        db = FirebaseConnection.getDatabase();
    }

    public void submitRecipe(Recipe recipe) {
        // Assign an ID and add to the in-memory list
        recipe.setId(currID++);
        recipes.add(recipe);
        updateFeaturedRecipe();

        // Prepare Firestore document
        Map<String, Object> recipeData = new HashMap<>();
        recipeData.put("id", recipe.getId());
        recipeData.put("name", recipe.getName());
        recipeData.put("description", recipe.getDescription());
        recipeData.put("Countries", recipe.getCountries());
        recipeData.put("imgages",recipe.getImages());
        recipeData.put("comments",recipe.getComments());
        recipeData.put("tags",recipe.getTags());
        recipeData.put("notes",recipe.getNotes());
        recipeData.put("directions",recipe.getDirections());
        recipeData.put("rating",recipe.getRating());
        recipeData.put("ingredients", recipe.getIngredients()); // Ensure ingredients are serializable
        recipeData.put("author", recipe.getAuthorId());
        // Firestore reference
        DocumentReference recipeRef = db.collection("recipes").document(String.valueOf(recipe.getId()));
        // Upload to Firestore
        ApiFuture<com.google.cloud.firestore.WriteResult> result = recipeRef.set(recipeData);

        try {
            System.out.println("Recipe uploaded at: " + result.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            System.err.println("Error uploading recipe: " + e.getMessage());
        }
    }

    public void submitReport(Report report) {
        // Assign an ID and add to the in-memory list

        // Prepare Firestore document
        Map<String, Object> reportData = new HashMap<>();
        reportData.put("id", report.getId());
        reportData.put("description", report.getDescription());
        reportData.put("postId", report.getPostId());
        reportData.put("reason", report.getReason());
        reportData.put("commentId", report.getCommentId());
        reportData.put("assignee", report.getAssignee());

        // this.id = id;
        // this.postId = postId;
        // this.commentId = commentId;
        // this.reason = reason;
        // this.description = description;

        // Firestore reference
        DocumentReference reportRef = db.collection("reports").document(String.valueOf(report.getId()));
        // Upload to Firestore
        ApiFuture<com.google.cloud.firestore.WriteResult> result = reportRef.set(reportData);

        try {
            System.out.println("Recipe uploaded at: " + result.get().getUpdateTime());
        } catch (InterruptedException | ExecutionException e) {
            e.printStackTrace();
            System.err.println("Error uploading recipe: " + e.getMessage());
        }
        reports.add(report);
    }

    public void addIngredient(Ingredient ingredient) {
        ingredients.add(ingredient);

    }

    public void updateFeaturedRecipe() {

    }

    public boolean deleteById(int id) {
        Recipe rem = getRecipeByID(id);
        if (rem != null) {
            recipes.remove(id);
            return true;
        }
        return false;
    }

    public CountryInfo getCountryInfo(String country, int limit) {
        if (countries.containsKey(country)) {
            return countries.get(country);
        }
        return null;

    }
    //
    public Recipe getFeaturedRecipe() {
        for (Recipe r : recipes) {
            if (r.getId() == featuredRecipeID) {
                return r;
            }
        }
        return null;
    }

    public Recipe getRecipeByID(int id) {
        DocumentReference recipeRef = db.collection("recipes").document(String.valueOf(id));
        ApiFuture<DocumentSnapshot> future = recipeRef.get();

        try {
            DocumentSnapshot document = future.get();
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

    public Ingredient getIngredientByID(int id) {
        DocumentReference recipeRef = db.collection("recipes").document(String.valueOf(id));
        ApiFuture<DocumentSnapshot> future = recipeRef.get();

        try {
            DocumentSnapshot document = future.get();
            if (document.exists()) {
                Recipe recipe = document.toObject(Recipe.class);
                return recipe.getIngredients().get(id);
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

    public Report getReportByID(Integer id) {
        DocumentReference reportRef = db.collection("reports").document(String.valueOf(id));
        ApiFuture<DocumentSnapshot> future = reportRef.get();

        try {
            DocumentSnapshot document = future.get();
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
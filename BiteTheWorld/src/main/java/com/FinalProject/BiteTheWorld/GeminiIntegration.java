package com.FinalProject.BiteTheWorld;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.ObjectMapper;

public class GeminiIntegration {
    public static String generate(String body) {
        String apiKey;

        try {
            apiKey = Files.readString(Path.of("src/main/resources/gemini_api_key.txt"));
        } catch (IOException e) {
            System.out.println("Error reading API key");
            return null;
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key="
                + apiKey;

        try {
            HttpClient client = HttpClient.newHttpClient();

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (IOException | InterruptedException e) {
            System.out.println("Error making request to Gemini API");
            return null;
        }
    }

    private static String describeRecipe(Recipe recipe) {
        String ingredients = recipe.ingredients.stream()
                .map(ingredient -> ingredient.name)
                .collect(Collectors.joining(","));

        return String.format("""
                {"text": "
                    Name of recipe: %s
                    Description: %s
                    Ingredients: %s
                "}
                """, recipe.name, recipe.description, ingredients);
    }

    public static String generateCountrySummary(List<Recipe> recipes) {
        StringBuilder partsBuilder = new StringBuilder();

        for (int i = 0; i < recipes.size() - 1; i++) {
            partsBuilder.append(describeRecipe(recipes.get(i)));
            partsBuilder.append(",");
        }

        partsBuilder.append(describeRecipe(recipes.get(recipes.size() - 1)));

        String body = String.format(
                """
                            {
                              "systemInstruction": {
                                "parts": [
                                  {"text" : "You are an experienced food guide. Give a summary of the country's cuisine based on the recipes listed. Treat each entry as a separate recipe. Only output the summary."}
                                ]
                              },
                              "contents": [{
                                "parts": [
                                   %s
                                ]
                              }],
                              "generationConfig": {
                                "response_mime_type": "plain/text"
                              }
                            }
                        """,
                partsBuilder.toString());

        return generate(body);
    }

    public static String generateRecommendations(List<Recipe> allRecipes, List<String> userPostViews) {
        // Split viewed and candidate recipes
        List<Recipe> viewedRecipes = allRecipes.stream()
                .filter(recipe -> userPostViews.contains(recipe.getId()))
                .collect(Collectors.toList());
    
        List<Recipe> candidateRecipes = allRecipes.stream()
                .filter(recipe -> !userPostViews.contains(recipe.getId()))
                .collect(Collectors.toList());
    
        if (viewedRecipes.isEmpty() || candidateRecipes.isEmpty()) {
            return "[]"; // no data to work with
        }
    
        // Describe viewed recipes
        String viewedParts = viewedRecipes.stream()
                .map(GeminiIntegration::describeRecipe)
                .collect(Collectors.joining(","));
    
        // Describe candidate recipes
        String candidateParts = candidateRecipes.stream()
                .map(GeminiIntegration::describeRecipe)
                .collect(Collectors.joining(","));
    
        // Prompt body with both viewed and candidate sections
        String body = String.format(
            """
            {
              "systemInstruction": {
                "parts": [
                  {"text": "You are a smart food recommender system. Based on the first list of recipes that the user has viewed, recommend three recipes from the second list. Focus on matching cuisines, ingredients, or tags. Output only a JSON array of the recommended Recipe objects (with name, description, ingredients, and optionally countries, images, and tags). Do not include any extra explanation."}
                ]
              },
              "contents": [{
                "parts": [
                  {"text": "Viewed Recipes:\\n[%s]"},
                  {"text": "Candidate Recipes:\\n[%s]"}
                ]
              }],
              "generationConfig": {
                "response_mime_type": "application/json"
              }
            }
            """,
            viewedParts,
            candidateParts
        );
    
        return generate(body);
    }
    
    

    // Add this method to the GeminiIntegration class
    public static List<Recipe> parseRecommendations(String json) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.readValue(json,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, Recipe.class));
        } catch (IOException e) {
            System.out.println("Error parsing recommendations: " + e.getMessage());
            return null;
        }
    }
}
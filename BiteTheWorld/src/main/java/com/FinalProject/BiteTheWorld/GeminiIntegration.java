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

import com.fasterxml.jackson.databind.JsonNode;
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

    String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;

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
    ObjectMapper mapper = new ObjectMapper();

    String description = String.format("""
        Name of recipe: %s
        Description: %s
        Ingredients: %s
        """,
        recipe.name != null ? recipe.name : "N/A",
        recipe.description != null ? recipe.description : "N/A",
        recipe.ingredients != null
            ? recipe.ingredients.stream().map(ing -> ing.name).collect(Collectors.joining(", "))
            : "N/A");

    try {
      return mapper.writeValueAsString(new TextWrapper(description));
    } catch (IOException e) {
      System.out.println("Error serializing recipe: " + e.getMessage());
      return "{\"text\": \"Invalid recipe data\"}";
    }
  }

  public static String generateRecommendations(List<Recipe> allRecipes, List<String> userPostViews) {
    List<Recipe> viewedRecipes = allRecipes.stream()
        .filter(recipe -> userPostViews.contains(recipe.getId()))
        .collect(Collectors.toList());

    List<Recipe> candidateRecipes = allRecipes.stream()
        .filter(recipe -> !userPostViews.contains(recipe.getId()))
        .collect(Collectors.toList());

    if (viewedRecipes.isEmpty() || candidateRecipes.isEmpty()) {
      return "[]";
    }

    ObjectMapper mapper = new ObjectMapper();
    String viewedJson, candidateJson;

    try {
      viewedJson = mapper.writeValueAsString(viewedRecipes);
      candidateJson = mapper.writeValueAsString(candidateRecipes);
    } catch (IOException e) {
      System.out.println("Error serializing recipe lists: " + e.getMessage());
      return "{\"error\": \"Failed to serialize recipe data\"}";
    }

    GeminiRequest request = new GeminiRequest(
        new SystemInstruction(List.of(new TextPart(
            "You are a smart food recommender system. Based on the first list of recipes that the user has viewed, recommend three recipes from the second list. Focus on matching cuisines, ingredients, or tags. Output a JSON array of the IDs of the recommended recipes. Do not include any extra explanation."
        ))),
        List.of(new Content(List.of(
            new TextPart("Viewed Recipes:\n" + viewedJson),
            new TextPart("Candidate Recipes:\n" + candidateJson)
        ))),
        new Object() {
          public final String response_mime_type = "application/json";
        }
    );

    try {
      String body = mapper.writeValueAsString(request);
      return generate(body);
    } catch (IOException e) {
      System.out.println("Error building Gemini request: " + e.getMessage());
      return null;
    }
  }
  public static String generateCountrySummary(List<Recipe> recipes) {
    ObjectMapper mapper = new ObjectMapper();
  
    StringBuilder partsBuilder = new StringBuilder();
    for (Recipe recipe : recipes) {
      partsBuilder.append(describeRecipe(recipe)).append(",");
    }
  
    // Remove trailing comma
    if (partsBuilder.length() > 0 && partsBuilder.charAt(partsBuilder.length() - 1) == ',') {
      partsBuilder.setLength(partsBuilder.length() - 1);
    }
  
    String body = String.format(
        """
        {
          "systemInstruction": {
            "parts": [
              {"text" : "You are an experienced food guide. Give a summary of the country's cuisine based on the recipes listed. Treat each entry as a separate recipe. Only output the summary. Work off what you are given, and don't mention anything about the number of recipes. If there are no recipes, output 'No recipes had been added yet.'"}
            ]
          },
          "contents": [{
            "parts": [
              %s
            ]
          }],
          "generationConfig": {
            "response_mime_type": "text/plain"
          }
        }
        """,
        partsBuilder.toString());
  
        String response = generate(body);

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // 1. Parse outer response
            JsonNode root = objectMapper.readTree(response);
        
            // 2. Navigate to text string inside the first candidate
            return root.path("candidates")
              .path(0)
              .path("content")
              .path("parts")
              .path(0)
              .path("text")
              .asText();
        } catch (Exception e) {
          return null;
        }
  }
  
  public static List<String> parseRecommendations(String json) {
  ObjectMapper objectMapper = new ObjectMapper();
  try {
    // 1. Parse outer response
    JsonNode root = objectMapper.readTree(json);

    // 2. Navigate to text string inside the first candidate
    String text = root.path("candidates")
                      .path(0)
                      .path("content")
                      .path("parts")
                      .path(0)
                      .path("text")
                      .asText();

    // 3. Parse the text string as a strings
    return objectMapper.readValue(
      text,
      objectMapper.getTypeFactory().constructCollectionType(List.class, String.class)
    );
  } catch (IOException e) {
    System.out.println("Error parsing recommendations: " + e.getMessage());
    return null;
  }
}


  // Helper class to wrap plain text
  static class TextWrapper {
    public String text;

    public TextWrapper(String text) {
      this.text = text;
    }
  }

  // Nested classes for request construction
  static class TextPart {
    public String text;

    public TextPart(String text) {
      this.text = text;
    }
  }

  static class Content {
    public List<TextPart> parts;

    public Content(List<TextPart> parts) {
      this.parts = parts;
    }
  }

  static class SystemInstruction {
    public List<TextPart> parts;

    public SystemInstruction(List<TextPart> parts) {
      this.parts = parts;
    }
  }

  static class GeminiRequest {
    public SystemInstruction systemInstruction;
    public List<Content> contents;
    public Object generationConfig;

    public GeminiRequest(SystemInstruction systemInstruction, List<Content> contents, Object generationConfig) {
      this.systemInstruction = systemInstruction;
      this.contents = contents;
      this.generationConfig = generationConfig;
    }
  }
}

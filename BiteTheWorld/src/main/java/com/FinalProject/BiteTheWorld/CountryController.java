package com.FinalProject.BiteTheWorld;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/country")
public class CountryController {
    private final ContentSystem contentSystem;

    public CountryController() {
        this.contentSystem = ContentSystem.getInstance();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CountryOverview> get(@PathVariable String id) {
        try {
            CountryInfo countryInfo = contentSystem.getCountryInfo(id);

            if (countryInfo == null) {
                return ResponseEntity.notFound().build();
            }

            List<Recipe> recipes = contentSystem.getRecipesByCountry(id, 20);
            List<RecipeOverview> listings;

            if (recipes == null) {
                listings = null;
            } else {
                listings = new ArrayList<>(recipes.size());

                for (Recipe recipe : recipes) {
                    listings.add(recipe.toListing());
                }
            }

            CountryOverview countryPage = new CountryOverview(countryInfo, listings);
            return ResponseEntity.ok(countryPage);
        }  catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
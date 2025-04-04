package com.FinalProject.BiteTheWorld;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/country")
public class CountryController {
    private final ContentSystem contentSystem;

    public CountryController() {
        this.contentSystem = ContentSystem.getInstance();
    }

    @PostMapping("/{id}")
    public ResponseEntity<CountryPage> get(@PathVariable String id) {
        try {
            CountryInfo countryInfo = contentSystem.getCountryInfo(id);
            List<Recipe> recipes = contentSystem.getRecipesByCountry(id);
            
            if (countryInfo == null || recipes == null) {
                return ResponseEntity.notFound().build();
            }

            CountryPage countryPage = new CountryPage(countryInfo, recipes);
            return ResponseEntity.ok(countryPage);
        }  catch (Exception e) {
            System.out.println("Erorr: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
package com.FinalProject.BiteTheWorld;

import java.util.List;

class CountryOverview {
    public CountryInfo country;
    public List<RecipeOverview> recipes;

    public CountryOverview() {
        
    }

    public CountryOverview(CountryInfo country, List<RecipeOverview> recipes) {
        this.country = country;
        this.recipes = recipes;
    }
}

package com.FinalProject.BiteTheWorld;

import java.util.List;

class CountryPage {
    public CountryInfo country;
    public List<Recipe> recipes;

    public CountryPage() {
        this.country = null;
        this.recipes = null;
    }

    public CountryPage(CountryInfo country, List<Recipe> recipes) {
        this.country = country;
        this.recipes = recipes;
    }
}

package com.FinalProject.BiteTheWorld;

import com.google.cloud.firestore.annotation.DocumentId;

class CountryInfo {
    @DocumentId private String name;
    public String summary;

    public CountryInfo() {

    }

    public String getName() {
        return name;
    }
}

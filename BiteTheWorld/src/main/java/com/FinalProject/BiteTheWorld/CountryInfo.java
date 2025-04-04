package com.FinalProject.BiteTheWorld;

import com.google.cloud.firestore.annotation.DocumentId;

class CountryInfo {
    @DocumentId private String id;
    public String name;
    public String summary;

    public CountryInfo() {

    }
}

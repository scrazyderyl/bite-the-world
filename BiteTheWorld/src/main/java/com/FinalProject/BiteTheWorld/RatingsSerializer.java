package com.FinalProject.BiteTheWorld;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.BeanProperty;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.ContextualSerializer;

public class RatingsSerializer extends JsonSerializer<Ratings> implements ContextualSerializer {
    private final String userId;

    public RatingsSerializer() {
        this.userId = null;
    }

    public RatingsSerializer(String userId) {
        this.userId = userId;
    }

    @Override
    public JsonSerializer<?> createContextual(SerializerProvider prov, BeanProperty property) {
        String userId = (String) prov.getAttribute("userId");
        return new RatingsSerializer(userId);
    }

    @Override
    public void serialize(Ratings ratings, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();
        gen.writeNumberField("average", ratings.average());
        gen.writeNumberField("count", ratings.count());

        String uid = (String) serializers.getAttribute("uid");
        Integer userRating = ratings.getUserRating(uid);

        gen.writeNumberField("user_rating", userRating == null ? -1 : userRating);
        gen.writeEndObject();
    }
}

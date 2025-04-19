package com.FinalProject.BiteTheWorld;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PositiveNumberOrFractionValidator implements ConstraintValidator<PositiveNumberOrFraction, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.trim().isEmpty()) return false;

        // Remove spaces
        String cleaned = value.replaceAll(" ", "");

        // Integer or decimal check
        if (cleaned.matches("^[+]?(\\d+)(\\.\\d+)?$")) {
            try {
                double number = Double.parseDouble(cleaned);
                return number > 0;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        // Fraction match
        if (cleaned.matches("^[+]?(\\d+)/(\\d+)$")) {
            try {
                String[] parts = cleaned.split("/");
                int numerator = Integer.parseInt(parts[0]);
                int denominator = Integer.parseInt(parts[1]);
                return denominator != 0 && (double) numerator / denominator > 0;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        return false;
    }
}
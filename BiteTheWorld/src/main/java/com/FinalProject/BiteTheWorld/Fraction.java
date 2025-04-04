package com.FinalProject.BiteTheWorld;

import jakarta.validation.constraints.Positive;

class Fraction {
    @Positive
    public int numerator;

    @Positive
    public int denominator;

    public Fraction() {
        
    }

    public Fraction(int numerator, int denominator) {
        this.numerator = numerator;
        this.denominator = denominator;
    }
}
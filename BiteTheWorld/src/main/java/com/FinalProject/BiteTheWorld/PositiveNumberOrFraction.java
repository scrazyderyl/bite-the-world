package com.FinalProject.BiteTheWorld;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PositiveNumberOrFractionValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface PositiveNumberOrFraction {

    String message() default "Must be a positive number (integer, decimal, or fraction)";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
import React from "react";

const UploadRecipeTest = () => {
    const submitTestRecipe = async () => {
        const testRecipe = {
            idToken: null, // User is not logged in
            name: "Test Recipe",
            tags: null,
            countries: ["USA"],
            description: "Description",
            images: null,
            prepTime: 10,
            cookTime: 20,
            servings: 4,
            ingredients: [
                {
                    id: 1,
                    name: "Test Ingredient",
                    quantity: { numerator: 1, denominator: 2 }, // Assuming Fraction is represented like this
                    quantityUnit: "cup",
                },
            ],
            directions: ["Step 1", "Step 2"],
            notes: "Some notes",
        };

        const response = await fetch("http://localhost:8080/recipes/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testRecipe),
        });

        if (response.ok) {
            console.log("Recipe ID:", response.body())
        } else {
            console.error("Recipe submission failed:", response.statusText);
        }
    };

    const fetchRecipeById = async () => {
        const recipeId = "";

        const response = await fetch(`http://localhost:8080/recipes/${recipeId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken: null }), // Assuming no authentication is required
        });

        if (response.ok) {
            const recipe = await response.json();
            console.log("Fetched recipe:", recipe);
        } else {
            console.error("Recipe fetch failed:", response.statusText);
        }
    };

    const deleteRecipeById = async () => {
        const recipeId = "";

        const response = await fetch(`http://localhost:8080/recipes/${recipeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken: null }), // Assuming no authentication is required
        });

        if (response.ok) {
            console.log("Recipe deleted successfully!");
        } else {
            console.error("Recipe delete failed:", response.statusText);
        }
    };

    return (
        <></>
    );
};

export default UploadRecipeTest;
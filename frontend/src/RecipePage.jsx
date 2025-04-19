import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import "../Styles/Recipes.css";
import { auth } from "./firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RecipePage() {
    const [recipeInfo, setRecipeInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const { recipe_id } = useParams();

    const fetchRecipe = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            const body = { idToken };

            console.log("Fetching Recipe with ID:", recipe_id);
            const response = await fetch(`http://localhost:8080/recipes/${recipe_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                console.error("Error fetching Recipe:", response.status);
                throw new Error("Failed to fetch Recipe");
            }

            const result = await response.json();
            setRecipeInfo(result);
        } catch (error) {
            toast.error("Failed to view Recipe. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipe();
    }, [recipe_id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (recipeInfo &&
        <>
            <div className="recipe-card">
                <h2 className="recipe-title">{recipeInfo.name}</h2>
                <p className="recipe-description">Author: {recipeInfo.authorId}</p>
                <img src={recipeInfo.image} alt={recipeInfo.name} />
                <p className="recipe-description">Description: {recipeInfo.description}</p>
                <p className="recipe-description">Instructions:</p>
                <ul className="recipe-description">
                    {recipeInfo.instructions && recipeInfo.instructions.map((step, index) => (
                        <li key={index}>{step}</li>
                    ))}
                </ul>
                <p className="recipe-description">Ingredients:</p>
                <ul className="recipe-description">
                    {recipeInfo.ingredients && recipeInfo.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default RecipePage;
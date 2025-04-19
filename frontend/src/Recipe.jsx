import { useState, useEffect } from 'react';
import { useParams } from "react-router";
import { auth } from "./firebaseConfig";
import { toast } from "react-toastify";

import "../Styles/Recipes.css";
import "react-toastify/dist/ReactToastify.css";

function Recipe() {
    const [recipeInfo, setRecipeInfo] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const { recipe_id } = useParams();

    const fetchRecipe = async () => {
        try {
            const idToken = await auth.currentUser.getIdToken();
            const body = {
                idToken: idToken,
            };
            console.log("Fetching recipe with ID:", recipe_id);
            const response = await fetch(`http://localhost:8080/recipes/${recipe_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                console.error("Error fetching recipe:", response.status);
                throw new Error("Failed to fetch recipe");
            }

            const result = await response.json();
            setRecipeInfo(result);
        } catch (error) {
            toast.error("Failed to view recipe. Please try again.");
        } finally {
            setLoading(false); // Set loading to false when fetch is done
        }
    };
    
    useEffect(() => {
        fetchRecipe();
    }, [recipe_id]); // Run fetchRecipe only when recipe_id changes

    if (loading) {
        return <div>Loading...</div>; // Show loading message
    }
  
    return (recipeInfo &&
        <>
              <div className="recipe-card">
                {/* <div className="recipe-actions">
                  <button className="bookmark-btn" onClick={() => handleBookmarkRecipe(recipe)}>
                    Bookmark
                  </button>
                </div> */}
                <h2 className="recipe-title">{recipeInfo.name}</h2>
                <p className="recipe-description">Author: {recipeInfo.authorId} Date: {recipeInfo.lastUpdated} Views: {recipeInfo.views}</p>
                <p className="recipe-description">Cooking Time: {recipeInfo.cookTime + recipeInfo.prepTime}</p>
                <p className="recipe-description">Servings: {recipeInfo.servings}</p>
                
                <h3 className = "recipe-description">Ingredients: </h3>
                <ol className="ingredient-list">
                  {Array.isArray(recipeInfo.ingredients) ? (
                    recipeInfo.ingredients.map((ing, i) => (
                    <li key={i} className="ingredient-item">
                      {ing.quantity} {ing.quantityUnit} {ing.name}
                    </li>
                  ))
                  ) : (
                    <li>No ingredients available</li>
                )}
                </ol>

                <h3 className="recipe-description">Instructions: </h3>
                <ol>
                  {Array.isArray(recipeInfo.directions) ? (
                    recipeInfo.directions.map((step, i) => (
                      <li key={i} className="ingredient-item">
                        {typeof step === 'object' ? step.step : step}
                      </li>
                    ))
                  ) : (
                    <li>No instructions available</li>
                  )}
                </ol>


              </div>
        </>
    )
}

const styles = {
    summary: {
        fontSize: "20px",
    }
}

export default Recipe;
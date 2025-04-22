import { useState, useEffect, useId } from 'react';
import { useNavigate, useParams } from "react-router";
import { auth } from "./firebaseConfig";
import { toast } from "react-toastify";
import { useOverlay } from "./OverlayContext";

import "../Styles/Recipes.css";
import "react-toastify/dist/ReactToastify.css";
import ReportForm, { getDefaultValues } from './ReportForm';

function Recipe({ user }) {
    const [recipeInfo, setRecipeInfo] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const { recipe_id } = useParams();
    const navigate = useNavigate();
    const { showOverlay, hideOverlay } = useOverlay();
    const id = useId();

    const fetchRecipe = async () => {
        try {
            const idToken = auth.currentUser ? await auth.currentUser.getIdToken() : null;
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

            // Convert date to readable format
            result.lastUpdated = new Date(result.lastUpdated).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

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

    function editRecipe() {
      navigate(`/recipes/edit/${recipe_id}`);
    }

    async function deleteRecipe() {
      const error = () => toast.error("Could not delete recipe.");

      try {
        const request = await fetch(`http://localhost:8080/recipes/${recipe_id}`, {
          method: "DELETE",
        });
  
        if (request.ok) {
          navigate('/');
        } else {
          error();
        }
      } catch (e) {
        error();
      }
    }

    function reportRecipe() {
      showOverlay(id, (
        <div className="form-container" style={{ width: "600px"}}>
          <button className="close-button" onClick={() => hideOverlay(id)}></button>
          <ReportForm values={getDefaultValues(recipe_id, "Recipe")} onSuccess={() => toast.success("Report recieved")}/>
        </div>
      ));
    }
  
    return (recipeInfo &&
      <>
          <div className="recipe-card">
          { user && recipeInfo.authorId === user.uid && (
            <div className='recipe-management'>
            <p className='recipe-action' onClick={editRecipe}>✎ Edit</p>
            <p className='recipe-action' onClick={deleteRecipe}>✖ Delete</p>
            </div>
          )}
          <h2 className="page-title">{recipeInfo.name}</h2>
          <div className="recipe-metadata">
            <p className="author-name">{recipeInfo.authorName}</p>
            <p className="date">{recipeInfo.lastUpdated}</p>
          </div>
          <p className="recipe-description">{recipeInfo.views} views</p>
          <div className="recipe-details">
            <p className="recipe-description">Total Time: {recipeInfo.cookTime + recipeInfo.prepTime}</p>
            <p className="recipe-description">Servings: {recipeInfo.servings}</p>
          </div>
          <p className="recipe-description summary">{recipeInfo.description}</p>
          {/* Replace with proper image viewer */}
          <img className="recipe-image" src={recipeInfo.images && recipeInfo.images[0] ? recipeInfo.images[0] : null} width="500" />
          
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
          <h3 className="recipe-description">Notes: </h3>
          <p className="recipe-description">{ recipeInfo.notes }</p>
          <div className="tag-container">
            <p>Tags</p>
            <div className="tags">
              {recipeInfo.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
          <p className='recipe-action report-button' onClick={reportRecipe}>Report</p>
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
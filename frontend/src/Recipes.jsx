import { useEffect, useState } from "react";
import "../Styles/Recipes.css"

function Recipes() {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("/recipes.json")
      .then(res => res.json())
      .then(data => setRecipes(data));
  }, []);

  return (
    <div className = "recipes-container">
      {recipes.map(recipe => (
        <div key={recipe.id} className="recipe-card">
          <h2 className="recipe-title">{recipe.name}</h2>
          <p className="recipe-description">Cooking Time: {recipe.cookingTime}</p>
          <p className="recipe-description">Servings: {recipe.servings}</p>
          <h3 className="recipe-description">Ingredients: </h3>
          <ul className="ingredient-list">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="ingredient-item">
                {ing.quantity} {ing.unit} {ing.name}
              </li>
            ))}
          </ul>
          <h3 className="recipe-description">Instructions: </h3>
          <ol>
            {recipe.steps.map((step, i) => (
              <li key={i} className="ingredient-item">{step}</li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

export default Recipes;

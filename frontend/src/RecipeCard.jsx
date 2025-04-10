import React from "react";
import "./RecipeCard.css";

function RecipeCard({ recipe }) {
  return (
    <a href={`/recipes/${recipe.id}`} className="card-link">
      <div className="recipe-card">
        <div className="card-image-container">
          <img 
            src={recipe.thumbnail || '/placeholder-food.jpg'} 
            alt={recipe.name}
            className="card-image"
          />
          {recipe.rating > 0 && (
            <div className="rating-badge">
              <span className="rating-value">{recipe.rating.toFixed(1)}</span>
              <span className="rating-star">★</span>
            </div>
          )}
        </div>
        <div className="card-content">
          <h2 className="recipe-title">{recipe.name}</h2>
          <div className="recipe-meta">
            <div className="meta-item">
              <span className="meta-icon">👥</span>
              <span className="meta-text">{recipe.servings} servings</span>
            </div>
            <div className="meta-item">
              <span className="meta-icon">⏱️</span>
              <span className="meta-text">{recipe.totalTime}</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default RecipeCard;
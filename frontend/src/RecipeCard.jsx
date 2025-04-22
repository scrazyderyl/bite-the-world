import React from "react";
import { Link } from "react-router";
import "./RecipeCard.css";

function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="card-link">
      <div className="recipe-card">
        <div className="card-image-container">
          {recipe.thumbnail ? (
            <img 
              src={recipe.thumbnail} 
              alt={recipe.name}
              className="card-image"
            />
            ): (
              <p>No image</p>
            )
          }
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
    </Link>
  );
}

export default RecipeCard;
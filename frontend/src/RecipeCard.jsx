import { Link } from "react-router";

function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`}>
      <div className="recipe-card" href={`/recipes/${recipe.id}`}>
        <h2 className="recipe-title">{recipe.name}</h2>
        <img src={recipe.thumbnail} />
        <p className="recipe-description">Ratings: {recipe.rating == 0 ? "None" : recipe.rating.toFixed(1)}</p>
        <p className="recipe-description">Servings: {recipe.servings}</p>
        <p className="recipe-description">Total Time: {recipe.totalTime}</p>
      </div>
    </Link>
  )
}

export default RecipeCard;

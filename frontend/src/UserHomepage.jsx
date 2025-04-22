import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Recipes.css";
import { RecipeForm, getDefaultValues } from './RecipeForm';
import { auth } from "./firebaseConfig";
import RecipeCard from './RecipeCard';

const UserHomePage = ({ user }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);
  const [recommendedRecipes, setRecommendedRecipes] = useState([]);

  // Redirect to login page if not logged in
  if (!user) {
    navigate("/login");
  }

  useEffect(() => {
    // published recipes
    fetch(`http://localhost:8080/recipes/user/${user.uid}`)
      .then(res => res.json())
      .then(data => setRecipes(data));

    // drafts from localStorage
    const savedDrafts = localStorage.getItem('recipeDrafts');
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }

    // bookmarked recipes from localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedRecipes');
    if (savedBookmarks) {
      setBookmarkedRecipes(JSON.parse(savedBookmarks));
    }
  }, []);

  // drafts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recipeDrafts', JSON.stringify(drafts));
  }, [drafts]);

  // ookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookmarkedRecipes', JSON.stringify(bookmarkedRecipes));
  }, [bookmarkedRecipes]);

  const handleCreateDraft = () => {
    setEditingDraft(getDefaultValues());
    setShowDraftModal(true);
  };

  const handleEditDraft = (draft) => {
    setEditingDraft(draft);
    setShowDraftModal(true);
  };

  // eslint-disable-next-line no-unused-vars
  const handleSaveDraft = (values) => {
    const updatedDrafts = editingDraft.id
      ? drafts.map(d => d.id === editingDraft.id ? { ...values, id: editingDraft.id } : d)
      : [...drafts, { ...values, id: Date.now() }];

    setDrafts(updatedDrafts);
    setShowDraftModal(false);
    setEditingDraft(null);

    toast.success("Draft saved successfully!");
  };

  const handleDeleteDraft = (draftId) => {
    setDrafts(drafts.filter(d => d.id !== draftId));
    toast.info("Draft deleted");
  };

  const handlePublishDraft = (draft) => {
    // send draft to BACKEND
    const newRecipe = {
      ...draft,
      id: `recipe-${Date.now()}`,
      cookingTime: draft.totalTime,
      steps: draft.steps.map(s => s.step)
    };

    setRecipes([...recipes, newRecipe]);
    setDrafts(drafts.filter(d => d.id !== draft.id));

    toast.success("Recipe published successfully!");
  };

  const handleBookmarkRecipe = (recipe) => {
    if (!bookmarkedRecipes.some(r => r.id === recipe.id)) {
      setBookmarkedRecipes([...bookmarkedRecipes, recipe]);
      toast.success("Recipe bookmarked!");
    }
  };

  const handleRemoveBookmark = (recipeId) => {
    setBookmarkedRecipes(bookmarkedRecipes.filter(r => r.id !== recipeId));
    toast.info("Bookmark removed");
  };

  const getRecommendedRecipes = async () => {
    try {
      console.log("Fetching recommended recipes...");
      const idToken = await auth.currentUser.getIdToken();
      const body = { idToken };

      const response = await fetch("http://localhost:8080/api/gemini/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        toast.error("Failed to retrieve recommendations.");
        return;
      }

      const recommended = await response.json();
      setRecommendedRecipes(recommended);
      toast.success("Recommendations received!");
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Something went wrong while fetching recommendations.");
    }
  };


  return (
    <div className="user-homepage">
      <div className="header">
        <h2>Welcome to Bite the World, {user.displayName}!</h2>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation" style={styles.tabNavigation}>
        <button
          className={`tab-btn ${activeTab === 'myRecipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('myRecipes')}
        >
          My Recipes
        </button>
        <button
          className={`tab-btn ${activeTab === 'drafts' ? 'active' : ''}`}
          onClick={() => setActiveTab('drafts')}
        >
          Drafts
        </button>
        <button
          className={`tab-btn ${activeTab === 'bookmarked' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookmarked')}
        >
          Bookmarked Recipes
        </button>
      </div>
      <div className="tab-navigation" style={styles.tabNavigation}>
        <button
          className={`tab-btn ${activeTab === 'recommended' ? 'active' : ''}`}
          onClick={() => { setActiveTab('recommended'); getRecommendedRecipes(); }}
        >
          Recomend Recipes
        </button>
      </div>

      {/* Welcome Message - Shown when no tab is selected */}
      {!activeTab && (
        <div className="welcome-container">
          <div className="welcome-message">
            <h3>Get Started with Bite the World</h3>
            <p>Select a button to manage your recipes, drafts, or bookmarks.</p>
            <p>Or create a new recipe by clicking the "Create New Recipe" button</p>
          </div>
        </div>
      )}

      {/* My Recipes Tab */}
      {activeTab === 'myRecipes' && (
        <div className="recipes-container">
          {recipes.length > 0 ? (
            recipes.map(recipe => (
              <>
                <RecipeCard recipe={recipe} key={recipe.id} />
              </>
            ))
          ) : (
            <p className="no-recipes">No recipes yet. Create your first recipe!</p>
          )}
        </div>
      )}

      {/* Drafts Tab */}
      {activeTab === 'drafts' && (
        <div className="recipes-container">
          {drafts.length > 0 ? (
            <div className="drafts-grid">
              {drafts.map(draft => (
                <div key={draft.id} className="draft-card">
                  <h3>{draft.name || "Untitled Recipe"}</h3>
                  <p>Prep Time: {draft.prepTime}</p>
                  <p>Cook Time: {draft.cookTime}</p>
                  <p>Ingredients: {draft.ingredients.length}</p>
                  <p>Steps: {draft.steps.length}</p>
                  <div className="draft-actions">
                    <button onClick={() => handleEditDraft(draft)}>Edit</button>
                    <button onClick={() => handlePublishDraft(draft)}>Publish</button>
                    <button onClick={() => handleDeleteDraft(draft.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-drafts">No draft recipes yet. Start creating your first recipe!</p>
          )}
        </div>
      )}

      {/* Bookmarked Recipes Tab */}
      {activeTab === 'bookmarked' && (
        <div className="recipes-container">
          {bookmarkedRecipes.length > 0 ? (
            bookmarkedRecipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-actions">
                  <button
                    className="remove-bookmark-btn"
                    onClick={() => handleRemoveBookmark(recipe.id)}
                  >
                    Remove Bookmark
                  </button>
                </div>
                <h2 className="recipe-title">{recipe.name}</h2>
                <p className="recipe-description">Cooking Time: {recipe.cookingTime || recipe.totalTime}</p>
                <p className="recipe-description">Servings: {recipe.servings}</p>
                <h3 className="recipe-description">Ingredients: </h3>
                <ul className="ingredient-list">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="ingredient-item">
                      {ing.quantity} {ing.unit} {ing.ingredient || ing.name}
                    </li>
                  ))}
                </ul>
                <h3 className="recipe-description">Instructions: </h3>
                <ol>
                  {Array.isArray(recipe.steps) ? (
                    recipe.steps.map((step, i) => (
                      <li key={i} className="ingredient-item">
                        {typeof step === 'object' ? step.step : step}
                      </li>
                    ))
                  ) : (
                    <li>No instructions available</li>
                  )}
                </ol>
              </div>
            ))
          ) : (
            <p className="no-bookmarks">No bookmarked recipes yet. Explore recipes and bookmark your favorites!</p>
          )}
        </div>
      )}

      {/* Recommended Recipes Tab */}
      {activeTab === 'recommended' && (
        <div className="recipes-container">
          <h2>Recommended Recipes</h2>
          {recommendedRecipes.length > 0 ? (
            recommendedRecipes.map(recipe => (
              <RecipeCard recipe={recipe} key={recipe.id} />
            ))
          ) : (
            <p>No recommendations yet. Click the tab again to try fetching them.</p>
          )}
        </div>
      )}

    </div>
  );
};

const styles = {
  tabNavigation: {
    display: "grid",
    gridTemplateColumns: "max-content max-content max-content",
    columnGap: "12px",
    marginTop: "20px",
    marginBottom: "20px",
  }
}

export default UserHomePage;
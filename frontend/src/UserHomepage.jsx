import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Recipes.css";
import { RecipeForm, getDefaultValues } from './RecipeForm';

const UserHomePage = ({ user }) => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // published recipes
    fetch("/recipes.json")
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

  if (!user) {
    return;
  }

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
      ? drafts.map(d => d.id === editingDraft.id ? {...values, id: editingDraft.id} : d)
      : [...drafts, {...values, id: Date.now()}];
    
    setDrafts(updatedDrafts);
    setShowDraftModal(false);
    setEditingDraft(null);
    
    toast.success("Draft saved successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleDeleteDraft = (draftId) => {
    setDrafts(drafts.filter(d => d.id !== draftId));
    toast.info("Draft deleted", {
      position: "top-right",
      autoClose: 3000,
    });
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
    
    toast.success("Recipe published successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleBookmarkRecipe = (recipe) => {
    if (!bookmarkedRecipes.some(r => r.id === recipe.id)) {
      setBookmarkedRecipes([...bookmarkedRecipes, recipe]);
      toast.success("Recipe bookmarked!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleRemoveBookmark = (recipeId) => {
    setBookmarkedRecipes(bookmarkedRecipes.filter(r => r.id !== recipeId));
    toast.info("Bookmark removed", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="user-homepage">
      <div className="header">
        <h2>Welcome to Bite the World, {user.displayName}!</h2>
        <button 
          className="create-recipe-btn"
          onClick={handleCreateDraft}
        >
          Create New Recipe
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
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
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-actions">
                  <button className="bookmark-btn" onClick={() => handleBookmarkRecipe(recipe)}>
                    Bookmark
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
            <p className="no-recipes">No recipes yet. Create your first recipe!</p>
          )}
        </div>
      )}

      {/* Drafts Tab */}
      {activeTab === 'drafts' && (
        <div className="drafts-container">
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

      {/* Recipe Form Modal */}
      {showDraftModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button className="close-modal" onClick={() => {
              setShowDraftModal(false);
              setEditingDraft(null);
            }}>×</button>
            
            <h2>{editingDraft?.name ? `Edit Recipe: ${editingDraft.name}` : 'Create New Recipe'}</h2>

            <RecipeForm values={editingDraft}/>
          </div>
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line no-unused-vars
const additionalStyles = `
.user-homepage {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #e0e0e0;
  background-color: #121212;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.create-recipe-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.create-recipe-btn:hover {
  background-color: #66BB6A;
}

.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background-color: #1e1e1e;
  border-radius: 10px;
  margin-top: 30px;
}

.welcome-message {
  text-align: center;
  max-width: 600px;
  padding: 30px;
}

.welcome-message h3 {
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 24px;
}

.welcome-message p {
  color: #b0b0b0;
  margin-bottom: 15px;
  font-size: 16px;
}

.tab-navigation {
  display: flex;
  border-bottom: 1px solid #333;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #e0e0e0;
  background-color: #333;
  margin-right: 5px;
  border-radius: 5px 5px 0 0;
  transition: background-color 0.3s, color 0.3s;
}

.tab-btn:hover {
  background-color: #444;
  color: #ffffff;
}

.tab-btn.active {
  background-color: #2196F3;
  font-weight: bold;
  color: white;
}

.drafts-container {
  padding: 20px 0;
}

.drafts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.draft-card {
  border: 1px solid #333;
  padding: 15px;
  border-radius: 5px;
  background-color: #1e1e1e;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.draft-card h3 {
  color: #ffffff;
  margin-bottom: 10px;
}

.draft-card p {
  color: #b0b0b0;
  margin-bottom: 5px;
}

.draft-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.draft-actions button {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  color: white;
  font-weight: bold;
  transition: opacity 0.3s;
}

.draft-actions button:nth-child(1) {
  background-color: #2196F3;
}

.draft-actions button:nth-child(2) {
  background-color: #4CAF50;
}

.draft-actions button:nth-child(3) {
  background-color: #F44336;
}

.draft-actions button:hover {
  opacity: 0.8;
}

.no-drafts, .no-recipes, .no-bookmarks {
  text-align: center;
  color: #757575;
  padding: 40px 0;
  font-size: 18px;
  background-color: #1e1e1e;
  border-radius: 10px;
}

.bookmark-btn, .remove-bookmark-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
  transition: opacity 0.3s;
}

.bookmark-btn:hover, .remove-bookmark-btn:hover {
  opacity: 0.8;
}

.remove-bookmark-btn {
  background-color: #F44336;
}

.recipe-card {
  position: relative;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #1e1e1e;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.recipe-card h2 {
  color: #ffffff;
  margin-bottom: 15px;
}

.recipe-card p, .recipe-card h3 {
  color: #b0b0b0;
}

.recipe-card ul, .recipe-card ol {
  color: #b0b0b0;
  padding-left: 20px;
}

.recipe-card li {
  margin-bottom: 5px;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #1e1e1e;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.5);
  color: #e0e0e0;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #b0b0b0;
}

.close-modal:hover {
  color: #ffffff;
}

.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.form-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.ingredient-row, .step-row {
  background-color: #2d2d2d;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  border: 1px solid #333;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #ffffff;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  padding: 8px;
  border: 1px solid #333;
  border-radius: 3px;
  background-color: #2d2d2d;
  color: #e0e0e0;
}

.form-group input:focus, 
.form-group select:focus, 
.form-group textarea:focus {
  border-color: #2196F3;
  outline: none;
  box-shadow: 0 0 3px rgba(33, 150, 243, 0.5);
}

.step-group {
  flex: 3;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.add-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 15px;
  font-weight: bold;
  transition: background-color 0.3s;
}

.add-btn:hover {
  background-color: #66BB6A;
}

.remove-btn {
  background-color: #F44336;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 3px;
  cursor: pointer;
  align-self: flex-end;
  font-weight: bold;
  transition: background-color 0.3s;
}

.remove-btn:hover {
  background-color: #EF5350;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background-color: #757575;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.cancel-btn:hover {
  background-color: #9E9E9E;
}

.save-btn {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background-color: #42A5F5;
}

.error {
  color: #EF5350;
  font-size: 12px;
  margin-top: 3px;
}
`;

export default UserHomePage;
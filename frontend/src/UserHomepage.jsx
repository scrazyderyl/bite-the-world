import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/Recipes.css";

// Validation schema and initial values from your RecipeSubmit component
const validationSchema = Yup.object({
  name: Yup.string().required("Recipe name is required"),
  prepTime: Yup.string().required("Required"),
  cookTime: Yup.string().required("Required"),
  totalTime: Yup.string().required("Required"),
  servings: Yup.number().positive().integer().required("Required"),
  ingredients: Yup.array().of(
    Yup.object({
      ingredient: Yup.string().required("Ingredient name is required"),
      quantity: Yup.number()
        .positive("Must be a positive number")
        .required("Required"),
      unit: Yup.string().required("Select a unit"),
    })
  ),
  steps: Yup.array().of(
    Yup.object({
      step: Yup.string().required("Step description is required"),
    })
  ),
});

const unitOptions = [
  { value: "g", label: "Grams (g)" },
  { value: "kg", label: "Kilograms (kg)" },
  { value: "mg", label: "Milligrams (mg)" },
  { value: "lb", label: "Pounds (lb)" },
  { value: "oz", label: "Ounces (oz)" },
  { value: "ml", label: "Milliliters (ml)" },
  { value: "l", label: "Liters (l)" },
  { value: "cups", label: "Cups" },
  { value: "tsp", label: "Teaspoons (tsp)" },
  { value: "tbsp", label: "Tablespoons (tbsp)" },
  { value: "pt", label: "Pints (pt)" },
  { value: "qt", label: "Quarts (qt)" },
  { value: "gal", label: "Gallons (gal)" },
  { value: "in", label: "Inches (in)" },
  { value: "cm", label: "Centimeters (cm)" },
  { value: "pcs", label: "Pieces" },
  { value: "pinch", label: "Pinch" },
  { value: "dash", label: "Dash" },
];

const UserHomePage = ({ username }) => {
  const [activeTab, setActiveTab] = useState('myRecipes');
  const [recipes, setRecipes] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [bookmarkedRecipes, setBookmarkedRecipes] = useState([]);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [editingDraft, setEditingDraft] = useState(null);

  // Initialize empty draft
  const emptyDraft = {
    id: Date.now(),
    name: "",
    prepTime: "",
    cookTime: "",
    totalTime: "",
    servings: "",
    ingredients: [
      {
        ingredient: "",
        quantity: "",
        unit: "",
      },
    ],
    steps: [
      {
        step: "",
      },
    ],
  };

  useEffect(() => {
    // Fetch published recipes
    fetch("/recipes.json")
      .then(res => res.json())
      .then(data => setRecipes(data));
    
    // Load drafts from localStorage
    const savedDrafts = localStorage.getItem('recipeDrafts');
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }

    // Load bookmarked recipes from localStorage
    const savedBookmarks = localStorage.getItem('bookmarkedRecipes');
    if (savedBookmarks) {
      setBookmarkedRecipes(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save drafts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('recipeDrafts', JSON.stringify(drafts));
  }, [drafts]);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('bookmarkedRecipes', JSON.stringify(bookmarkedRecipes));
  }, [bookmarkedRecipes]);

  const handleCreateDraft = () => {
    setEditingDraft(emptyDraft);
    setShowDraftModal(true);
  };

  const handleEditDraft = (draft) => {
    setEditingDraft(draft);
    setShowDraftModal(true);
  };

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
    // Here you would typically send the draft to your backend API
    // For now, we'll just add it to the recipes array and remove from drafts
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
        <h2>Welcome to Bite the World, {username}!</h2>
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
            
            <Formik
              validationSchema={validationSchema}
              initialValues={editingDraft || emptyDraft}
              onSubmit={(values) => handleSaveDraft(values)}
            >
              {({ values }) => (
                <Form className="recipe-form">
                  <div className="form-group">
                    <label htmlFor="name">Recipe Name</label>
                    <Field
                      name="name"
                      placeholder="Recipe Name"
                      type="text"
                    />
                    <ErrorMessage name="name" component="div" className="error" />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="prepTime">Preparation Time</label>
                      <Field
                        name="prepTime"
                        placeholder="e.g., 20 mins"
                        type="text"
                      />
                      <ErrorMessage name="prepTime" component="div" className="error" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cookTime">Cook Time</label>
                      <Field
                        name="cookTime"
                        placeholder="e.g., 30 mins"
                        type="text"
                      />
                      <ErrorMessage name="cookTime" component="div" className="error" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="totalTime">Total Time</label>
                      <Field
                        name="totalTime"
                        placeholder="e.g., 50 mins"
                        type="text"
                      />
                      <ErrorMessage name="totalTime" component="div" className="error" />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="servings">Servings</label>
                      <Field
                        name="servings"
                        placeholder="e.g., 4"
                        type="number"
                      />
                      <ErrorMessage name="servings" component="div" className="error" />
                    </div>
                  </div>
                  
                  <h3>Ingredients</h3>
                  <FieldArray name="ingredients">
                    {({ remove, push }) => (
                      <div>
                        {values.ingredients.map((_, index) => (
                          <div className="form-row ingredient-row" key={index}>
                            <div className="form-group">
                              <label htmlFor={`ingredients.${index}.ingredient`}>
                                Ingredient {index + 1}
                              </label>
                              <Field
                                name={`ingredients.${index}.ingredient`}
                                placeholder="e.g., Apples"
                                type="text"
                              />
                              <ErrorMessage
                                name={`ingredients.${index}.ingredient`}
                                component="div"
                                className="error"
                              />
                            </div>
                            
                            <div className="form-group">
                              <label htmlFor={`ingredients.${index}.quantity`}>
                                Quantity
                              </label>
                              <Field
                                name={`ingredients.${index}.quantity`}
                                placeholder="e.g., 2"
                                type="text"
                              />
                              <ErrorMessage
                                name={`ingredients.${index}.quantity`}
                                component="div"
                                className="error"
                              />
                            </div>
                            
                            <div className="form-group">
                              <label htmlFor={`ingredients.${index}.unit`}>
                                Unit
                              </label>
                              <Field
                                as="select"
                                name={`ingredients.${index}.unit`}
                              >
                                <option value="">Select Unit</option>
                                {unitOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name={`ingredients.${index}.unit`}
                                component="div"
                                className="error"
                              />
                            </div>
                            
                            <button
                              type="button"
                              className="remove-btn"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          className="add-btn"
                          onClick={() => push({ ingredient: "", quantity: "", unit: "" })}
                        >
                          Add Ingredient
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  
                  <h3>Cooking Steps</h3>
                  <FieldArray name="steps">
                    {({ remove, push }) => (
                      <div>
                        {values.steps.map((_, index) => (
                          <div className="form-row step-row" key={index}>
                            <div className="form-group step-group">
                              <label htmlFor={`steps.${index}.step`}>
                                Step {index + 1}
                              </label>
                              <Field
                                as="textarea"
                                name={`steps.${index}.step`}
                                placeholder="Describe this step..."
                              />
                              <ErrorMessage
                                name={`steps.${index}.step`}
                                component="div"
                                className="error"
                              />
                            </div>
                            
                            <button
                              type="button"
                              className="remove-btn"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        
                        <button
                          type="button"
                          className="add-btn"
                          onClick={() => push({ step: "" })}
                        >
                          Add Step
                        </button>
                      </div>
                    )}
                  </FieldArray>
                  
                  <div className="form-buttons">
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => {
                        setShowDraftModal(false);
                        setEditingDraft(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="save-btn">
                      Save Draft
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

// CSS styles you'll need to add to your Recipes.css file
const additionalStyles = `
.user-homepage {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.create-recipe-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.tab-navigation {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.tab-btn.active {
  border-bottom: 3px solid #007bff;
  font-weight: bold;
  color: #007bff;
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
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
  background-color: #f9f9f9;
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
}

.draft-actions button:nth-child(1) {
  background-color: #007bff;
  color: white;
}

.draft-actions button:nth-child(2) {
  background-color: #28a745;
  color: white;
}

.draft-actions button:nth-child(3) {
  background-color: #dc3545;
  color: white;
}

.no-drafts, .no-recipes, .no-bookmarks {
  text-align: center;
  color: #777;
  padding: 40px 0;
}

.bookmark-btn, .remove-bookmark-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.remove-bookmark-btn {
  background-color: #dc3545;
}

.recipe-card {
  position: relative;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(165, 90, 90, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
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
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input, 
.form-group select, 
.form-group textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.step-group {
  flex: 3;
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.add-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 15px;
}

.remove-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 3px;
  cursor: pointer;
  align-self: flex-end;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.cancel-btn {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  cursor: pointer;
}

.save-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 3px;
  cursor: pointer;
}

.error {
  color: #dc3545;
  font-size: 12px;
  margin-top: 3px;
}
`;

export default UserHomePage;
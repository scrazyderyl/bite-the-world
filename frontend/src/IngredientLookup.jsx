import { React, useState } from "react";
import { toast } from "react-toastify";
import Async from 'react-select/async';
import { Formik, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";

import "./Form.css";
import "./IngredientLookup.css";
import RecipeCard from './RecipeCard';

function getDefaultValues() {
  return {
    ingredients: [],
  };
}

const validationSchema = Yup.object({
  ingredients: Yup.array()
    .min(1, "At least one ingredient is required"),
});

export default function IngredientLookup() {
  const [selectedIngredient, setSelectedIngredient] = useState();
  const [recipeInfo, setRecipeInfo] = useState(null);

  async function searchIngredient(name, callback) {
    const error = () => {
      toast.error("Ingredient lookup failed.");
      callback([]);
    }

    try {
      const body = {
        query: name
      }

      const response = await fetch("http://localhost:8080/ingredients/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        error();
        return;
      }

      const ingredients = await response.json();
      callback(ingredients.map(ingredient => ({ value: ingredient.id, label: ingredient.name })));
    } catch (e) {
      error();
    }
  }

  return (
    <>
      <div className="form-container">
        <h1 className="form-title">Look up Recipe by Ingredient</h1>
        <Formik
          validationSchema={validationSchema}
          initialValues={getDefaultValues()}
          onSubmit={async (values) => {
            try {
              setRecipeInfo(null);
              const body = values.ingredients.map(ingredient => ingredient.name);

              const response = await fetch(
                "http://localhost:8080/ingredients/getrecipe",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(body),
                }
              );

              if (!response.ok) {
                console.error("Error fetching recipe:", response.status);
                  toast.error("No recipes found for the given ingredients.");
                }
              else {
                const data = await response.json();
                toast.success("Fulfilled request successfully.");
                setRecipeInfo(data);
                console.log("Recipe id:", data.id);
              }

              //const result = await response.text();
              //console.log("Recipes:", result);
            } catch (error) {
              toast.error("An error occurred. Please try again.");
            }
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <div className="form-section">
                <FieldArray name="ingredients">
                  {({ remove, push }) => {
                    async function addIngredient(option) {
                      setSelectedIngredient(null);

                      // Check if ingredient already included
                      for (let ingredient of values.ingredients) {
                        if (ingredient.id === option.value) {
                          toast.warn("Ingredient is already added");

                          return;
                        }
                      }

                      var newIngredient = {
                        id: option.value,
                        name: option.label
                      };
                  
                      push(newIngredient);  
                    }

                    return <div>
                      <h2 className="form-subheading">Ingredients</h2>
                      <Async loadOptions={searchIngredient} onChange={addIngredient} value={selectedIngredient} styles={{
                        option: (provided, state) => ({
                          ...provided,
                          color: "black"
                        })
                      }}/>
                      {values.ingredients.length > 0 &&
                        values.ingredients.map((ingredient, index) => (
                          <div key={index} className="ingredient-entry">
                            <p className="ingredient-name">{ ingredient.name }</p>
                            <button
                              className="remove-button"
                              type="button"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                    </div>
                  }}
                </FieldArray>
                <ErrorMessage
                  name="ingredients"
                  component="div"
                  className="field-error"
                />
              </div>

              <button
                type="submit"
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Ingredients"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <div className="recipe-card-container">
        {recipeInfo && <RecipeCard key={recipeInfo.id} recipe={recipeInfo}/> }
      </div>
    </>
  );
}

export { IngredientLookup, getDefaultValues };

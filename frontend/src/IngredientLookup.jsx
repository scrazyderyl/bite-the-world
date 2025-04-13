import { React, useState } from "react";
import { toast } from "react-toastify";
import Async from 'react-select/async';
import { Formik, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";

import "./Form.css";
import "./IngredientLookup.css";

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

  async function searchIngredient(name, callback) {
    const error = () => {
      toast.error("Ingredient lookup failed.", {
        toastId: "ingredient-lookup-error",
        position: "top-right",
        autoClose: 3000,
      });
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
    <div className="recipe-form-container">
      <h1 className="form-title">Look up Recipe by Ingredient</h1>
      <Formik
        validationSchema={validationSchema}
        initialValues={getDefaultValues()}
        onSubmit={async (values) => {
          try {
            const body = values.ingredients.map(ingredient => ingredient.id);

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
              toast.error("Failed to fulfill request.", {
                position: "top-right",
                autoClose: 3000,
              });
              return;
            }

            const result = await response.text();
            console.log("Recipes:", result);
          } catch (error) {
            toast.error("An error occurred. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
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
                        toast.warn("Ingredient is already added", {
                          position: "top-right",
                          autoClose: 3000,
                        });

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
  );
}

export { IngredientLookup, getDefaultValues };

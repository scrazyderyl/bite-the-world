import { React, useState } from "react";
import Async from 'react-select/async';
import { auth } from "./firebaseConfig";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import TagInput from "./TagInput";
import { countries } from "./constants/countries";
import { units } from "./constants/units";
import "./Form.css"; 

function getDefaultValues() {
  return {
    name: "",
    tags: [],
    countries: [],
    description: "",
    images: [],
    prepTime: "",
    cookTime: "",
    servings: "",
    ingredients: [],
    directions: [],
    notes: "",
  };
}

const validationSchema = Yup.object({
  name: Yup.string()
    .max(127, "Name must be at most 127 characters")
    .required("Required"),
  tags: Yup.array().of(Yup.string()),
  countries: Yup.array()
    .of(Yup.string())
    .min(1, "At least one country must be selected"),
  description: Yup.string(),
  images: Yup.array().of(
    Yup.string().url("Each image must be a valid URL")
  ),
  prepTime: Yup.number()
    .typeError("Must be a number")
    .integer("Must be a whole number")
    .positive("Must be positive"),
  cookTime: Yup.number()
  .typeError("Must be a number")
  .integer("Must be a whole number")
  .positive("Must be positive"),
  servings: Yup.number()
  .typeError("Must be a number")
  .integer("Must be a whole number")
  .positive("Must be positive"),
  ingredients: Yup.array()
    .of(
      Yup.object({
        id: Yup.string(),
        name: Yup.string().required("Required"),
        quantity: Yup.string().required("Required")
          .test(
            'is-valid-number-or-fraction',
            'Must be a positive number (integer, decimal, or fraction)',
            (value) => {
              if (!value) return false;
        
              // Remove spaces
              const trimmed = value.replace(" ", "");
        
              // Check for integer or decimal
              const numberPattern = /^[+]?\d+(\.\d+)?$/;
        
              // Check for fraction (e.g., 1/2, 3/4)
              const fractionPattern = /^[+]?\d+\/\d+$/;
        
              if (numberPattern.test(trimmed)) {
                return parseFloat(trimmed) > 0;
              }
        
              if (fractionPattern.test(trimmed)) {
                const [numerator, denominator] = trimmed.split('/').map(Number);
                return denominator !== 0 && numerator / denominator > 0;
              }
        
              return false;
            }),
        quantityUnit: Yup.string()
          .required("Required")
      })
    )
    .min(1, "At least one ingredient is required"),
  directions: Yup.array()
    .of(
      Yup.string().required("Required")
    )
    .min(1, "At least one step is required"),
  notes: Yup.string(),
});

function RecipeForm({ values }) {
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
    <div className="form-container">
      <h1 className="form-title">Create Recipe</h1>
      <Formik
        validationSchema={validationSchema}
        initialValues={values || getDefaultValues()}
        onSubmit={async (values) => {
          try {
            const idToken = await auth.currentUser.getIdToken();
            const body = {
              idToken: idToken,
              ...values,
            };

            const response = await fetch("http://localhost:8080/recipes/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });

            if (!response.ok) {
              toast.error("Failed to submit recipe. Please try again.", {
                position: "top-right",
                autoClose: 3000,
              });
              return;
            }

            const result = await response.text();
            toast.success("Recipe submitted successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            console.log("Recipe ID:", result);
          } catch (error) {
            toast.error("An error occurred. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        }}
      >
        {({ values, isSubmitting, setFieldValue }) => (
          <Form>
            <div className="form-section">
              <h2 className="form-subheading">Recipe Details</h2>
              <div className="fields-grid" style={{ gridTemplateColumns: "1fr" }}>
                <Field
                  className="form-input"
                  name="name"
                  placeholder="Recipe Name"
                  type="text"
                />
                <div>
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="field-error"
                  />
                </div>
              </div>

              <h3 className="form-subheading">Overview</h3>
              <div className="fields-grid">
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Describe your recipe"
                  className="form-textarea"
                />
                <div>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="field-error"
                  />
                </div>
              </div>

              <div className="fields-grid" style={{ gridTemplateColumns: "160px 160px 100px" }}>
                <Field
                  className="form-input"
                  name="prepTime"
                  placeholder="Prep Time (mins)"
                  type="text"
                />
                <div>
                  <ErrorMessage
                    name="prepTime"
                    component="div"
                    className="field-error"
                  />
                </div>
                <Field
                  className="form-input"
                  name="cookTime"
                  placeholder="Cook Time (mins)"
                  type="text"
                />
                <div>
                  <ErrorMessage
                    name="cookTime"
                    component="div"
                    className="field-error"
                  />
                </div>
                <Field
                  className="form-input"
                  name="servings"
                  placeholder="Servings"
                  type="text"
                />
                <div>
                  <ErrorMessage
                    name="servings"
                    component="div"
                    className="field-error"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-subheading">Origin</h2>
              <div className="fields-grid" style={{ gridTemplateColumns: "min-content" }}>
                <Field
                  as="select"
                  name="countries"
                  multiple
                  className="form-select"
                  style={{ height: "200px" }}
                  onChange={(event) => {
                    const options = event.target.options;
                    const selectedValues = [];
                    for (let i = 0; i < options.length; i++) {
                      if (options[i].selected) {
                        selectedValues.push(options[i].value);
                      }
                    }
                    setFieldValue("countries", selectedValues);
                  }}
                >
                  {Object.entries(countries).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  ))}
                </Field>
                <div>
                  <ErrorMessage
                    name="countries"
                    component="div"
                    className="field-error"
                  />
                </div>
              </div>
            </div>

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
                      name: option.label,
                      quantity: "",
                      quantityUnit: "",
                    };
                
                    push(newIngredient);  
                  }

                  return (
                  <div>
                    <h2 className="form-subheading">Ingredients</h2>
                    <Async loadOptions={searchIngredient} onChange={addIngredient} value={selectedIngredient} styles={{
                      option: (provided, state) => ({
                        ...provided,
                        color: "black"
                      })
                    }}/>
                    {values.ingredients.length > 0 &&
                      values.ingredients.map((ingredient, index) => (
                        <div key={index}>
                          <p>{ ingredient.name }</p>
                          <div className="fields-grid" style={{ gridTemplateColumns: "90px 190px min-content" }}>
                            <Field
                              className="form-input"
                              name={`ingredients.${index}.quantity`}
                              placeholder="Quantity"
                              type="text"
                            />
                            <div>
                              <ErrorMessage
                                name={`ingredients.${index}.quantity`}
                                component="div"
                                className="field-error"
                              />
                            </div>
                            <Field
                              as="select"
                              className="form-select"
                              name={`ingredients.${index}.quantityUnit`}
                            >
                              <option value="" label="Select a unit" hidden />
                              {units.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Field>
                            <div>
                              <ErrorMessage
                                name={`ingredients.${index}.quantityUnit`}
                                component="div"
                                className="field-error"
                              />
                            </div>
                            <button
                              className="remove-button"
                              type="button"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}}
              </FieldArray>
            </div>

            <div className="form-section">
              <FieldArray name="directions">
                {({ remove, push }) => (
                  <div>
                    <h2 className="form-subheading">Directions</h2>
                    {values.directions.length > 0 &&
                      values.directions.map((step, index) => (
                        <div key={index} className="step-container">
                          <label
                            htmlFor={`directions.${index}`}
                            className="step-label"
                          >
                            Step {index + 1}
                          </label>
                          <div className="fields-grid" style={{ gridTemplateColumns: "500px min-content" }}>
                            <Field
                              as="textarea"
                              className="form-textarea"
                              name={`directions.${index}`}
                              placeholder="Describe the step"
                            />
                            <div>
                              <ErrorMessage
                                name={`directions.${index}`}
                                component="div"
                                className="field-error"
                              />
                            </div>
                            <button
                              className="remove-button"
                              type="button"
                              onClick={() => remove(index)}
                              style={{ alignSelf: "flex-start" }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    <button
                      className="add-button"
                      type="button"
                      onClick={() => push("")}
                    >
                      Add Step
                    </button>
                  </div>
                )}
              </FieldArray>
              <ErrorMessage
                name="directions"
                component="div"
                className="field-error"
              />
            </div>

            <div className="form-section">
              <h2 className="form-subheading">Notes</h2>
              <div className="fields-grid">
                <Field
                  as="textarea"
                  name="notes"
                  placeholder="Notes"
                  className="form-textarea"
                />
              </div>
              <h2 className="form-subheading">Tags</h2>
              <FieldArray name="tags">
                {({ push, remove }) => (
                  <TagInput
                    tags={values.tags}
                    push={push}
                    remove={remove}
                  />
                )}
              </FieldArray>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Recipe"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export { RecipeForm, getDefaultValues };
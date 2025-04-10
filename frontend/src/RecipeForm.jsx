import { React } from "react";
import { auth } from "./firebaseConfig";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { countries } from "./constants/countries";
import { units } from "./constants/units";
import "./RecipeForm.css"; 

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
    .typeError("Must be a positive number")
    .positive("Must be a positive number"),
  cookTime: Yup.number()
    .typeError("Must be a positive number")
    .positive("Must be a positive number"),
  servings: Yup.number()
    .typeError("Must be a positive number")
    .positive("Must be a positive number"),
  ingredients: Yup.array()
    .of(
      Yup.object({
        id: Yup.number()
          .typeError("Ingredient ID must be a number")
          .required("Required"),
        name: Yup.string().required("Ingredient name is required"),
        quantity: Yup.object({
          numerator: Yup.number()
            .typeError("Must be a positive number")
            .positive("Must be a positive number")
            .required("Required"),
          denominator: Yup.number()
            .typeError("Must be a positive number")
            .positive("Must be a positive number")
            .required("Required"),
        }),
        quantityUnit: Yup.string()
          .required("Required")
      })
    )
    .min(1, "At least one ingredient is required"),
  directions: Yup.array()
    .of(Yup.string().required("Each step is required"))
    .min(1, "At least one step is required"),
  notes: Yup.string(),
});

function RecipeForm({ values }) {
  return (
    <div className="recipe-form-container">
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
            console.log(body);

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
              <div className="fields-grid">
                <div>
                  <Field
                    className="form-input"
                    name="name"
                    placeholder="Recipe Name"
                    type="text"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="field-error"
                  />
                </div>
              </div>

              <h3 className="form-subheading">Overview</h3>
              <div>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Describe your recipe"
                  className="form-textarea"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="field-error"
                />
              </div>

              <div className="fields-grid">
                <div>
                  <Field
                    className="form-input"
                    name="prepTime"
                    placeholder="Preparation Time (mins)"
                    type="text"
                  />
                  <ErrorMessage
                    name="prepTime"
                    component="div"
                    className="field-error"
                  />
                </div>
                <div>
                  <Field
                    className="form-input"
                    name="cookTime"
                    placeholder="Cook Time (mins)"
                    type="text"
                  />
                  <ErrorMessage
                    name="cookTime"
                    component="div"
                    className="field-error"
                  />
                </div>
                <div>
                  <Field
                    className="form-input"
                    name="servings"
                    placeholder="Servings"
                    type="text"
                  />
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
              <Field
                as="select"
                name="countries"
                multiple
                className="form-select country-select"
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
              <ErrorMessage
                name="countries"
                component="div"
                className="field-error"
              />
            </div>

            <div className="form-section">
              <FieldArray name="ingredients">
                {({ remove, push }) => (
                  <div>
                    <h2 className="form-subheading">Ingredients</h2>
                    {values.ingredients.length > 0 &&
                      values.ingredients.map((ingredient, index) => (
                        <div key={index} className="ingredient-row">
                          <div>
                            <Field
                              className="form-input"
                              name={`ingredients.${index}.id`}
                              placeholder="ID"
                              type="text"
                            />
                            <ErrorMessage
                              name={`ingredients.${index}.id`}
                              component="div"
                              className="field-error"
                            />
                          </div>
                          <div>
                            <Field
                              className="form-input"
                              name={`ingredients.${index}.name`}
                              placeholder="Name"
                              type="text"
                            />
                            <ErrorMessage
                              name={`ingredients.${index}.name`}
                              component="div"
                              className="field-error"
                            />
                          </div>
                          <div>
                            <Field
                              className="form-input"
                              name={`ingredients.${index}.quantity.numerator`}
                              placeholder="Numerator"
                              type="text"
                            />
                            <ErrorMessage
                              name={`ingredients.${index}.quantity.numerator`}
                              component="div"
                              className="field-error"
                            />
                          </div>
                          <div>
                            <Field
                              className="form-input"
                              name={`ingredients.${index}.quantity.denominator`}
                              placeholder="Denominator"
                              type="text"
                            />
                            <ErrorMessage
                              name={`ingredients.${index}.quantity.denominator`}
                              component="div"
                              className="field-error"
                            />
                          </div>
                          <div>
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
                      ))}
                    <button
                      className="add-button"
                      type="button"
                      onClick={() =>
                        push({
                          id: "",
                          name: "",
                          quantity: { numerator: "", denominator: "" },
                          quantityUnit: "",
                        })
                      }
                    >
                      Add Ingredient
                    </button>
                  </div>
                )}
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
                          <div style={{ display: "flex", gap: "10px" }}>
                            <Field
                              as="textarea"
                              className="form-textarea"
                              name={`directions.${index}`}
                              placeholder="Describe the step"
                            />
                            <button
                              className="remove-button"
                              type="button"
                              onClick={() => remove(index)}
                              style={{ alignSelf: "flex-start" }}
                            >
                              Remove
                            </button>
                          </div>
                          <ErrorMessage
                            name={`directions.${index}`}
                            component="div"
                            className="field-error"
                          />
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
              <Field
                as="textarea"
                name="notes"
                placeholder="Optional notes about the recipe"
                className="form-textarea"
              />
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
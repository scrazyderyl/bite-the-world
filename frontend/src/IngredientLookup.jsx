import { React } from "react";
import { auth } from "./firebaseConfig";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { units } from "./constants/units";
import "./RecipeForm.css";
import Select from "react-select";

function getDefaultValues() {
  return {
    ingredients: [],
  };
}

const validationSchema = Yup.object({
  ingredients: Yup.array()
    .of(
      Yup.object({
        Ingredient: Yup.string().required("Required"),
      })
    )
    .min(1, "At least one ingredient is required"),
});

export default function IngredientLookup() {
  return (
    <div className="recipe-form-container">
      <h1 className="form-title">Look up Recipe by Ingredient</h1>
      <Formik
        validationSchema={validationSchema}
        initialValues={getDefaultValues()}
        onSubmit={async (values) => {
          try {
            const idToken = await auth.currentUser.getIdToken();
            const body = values.ingredients;
            console.log(body);
            console.log("submitted");

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
              toast.error("Failed to submit Ingredients. Please try again.", {
                position: "top-right",
                autoClose: 3000,
              });
              return;
            }

            const result = await response.text();
            toast.success("Ingredients submitted successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            console.log("Ingreidents ID:", result);
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
              <FieldArray name="ingredients">
                {({ remove, push }) => (
                  <div>
                    <h2 className="form-subheading">Ingredients</h2>
                    {values.ingredients.length > 0 &&
                      values.ingredients.map((ingredient, index) => (
                        <div key={index} className="ingredient-row">
                          <div>
                            <Select
                              className="form-lookup"
                              name={`ingredients.${index}.Ingredient`}
                              options={units}
                              placeholder="Search for a unit"
                              isSearchable
                              onChange={(selectedOption) =>
                                setFieldValue(
                                  `ingredients.${index}.Ingredient`,
                                  selectedOption.value
                                )
                              }
                            />
                            <ErrorMessage
                              name={`ingredients.${index}.Ingredient`}
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
                          Ingredient: "",
                        })
                      }
                    >
                      Add Ingredient
                    </button>
                  </div>
                )}
              </FieldArray>
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

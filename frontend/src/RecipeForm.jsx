import { React } from "react";
import { auth } from "./firebaseConfig";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { countries } from "./constants/countries";
import { units } from "./constants/units";

const DEFAULT_VALUES = {
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

function RecipeForm({values}) {
  <div style={styles.formContainer}>
    <div style={styles.section}>
      <h1 style={styles.title}>Add a new recipe</h1>
    </div>
    <Formik
      validationSchema={validationSchema}
      initialValues={values}
      onSubmit={async (values) => {
        try {
          const idToken = await auth.currentUser.getIdToken();

          const body = {
            idToken: idToken,
            ...values,
          }

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
          console.log("Recipe ID:", result); // Placeholder, need to redirect user to the new recipe page
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
          <div style={styles.section}>
            <div style={styles.fieldsHorizontal}>
              <Field
                style={styles.input}
                name="name"
                placeholder="Recipe Name"
                type="text"
              />
              <div>
                <ErrorMessage
                  name={`name`}
                  component="div"
                  style={styles.fieldError}
                />
              </div>
            </div>
            <div style={{...styles.fieldsHorizontal, gridTemplateRows: "1fr 30px"}}>
              <Field
                as="textarea"
                name="description"
                placeholder="Describe your recipe"
                style={styles.longText}
              />
              <div>
                <ErrorMessage
                  name="description"
                  component="div"
                  style={styles.fieldError}
                />
              </div>
            </div>
          </div>
          <div style={styles.section}>
            <div style={styles.formHorizontal}>
              <h1 style={styles.subheading}>
                Select Countries
              </h1>
              <Field
                as="select"
                name="countries"
                multiple
                size="10"
                style={{ ...styles.input, ...styles.countrySelect }}
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
                  style={styles.fieldError}
                />
              </div>
            </div>
          </div>
          <div style={styles.section}>
            <div style={styles.fieldsHorizontal}>
              <Field
                style={styles.input}
                name="prepTime"
                placeholder="Preparation Time"
                type="text"
              />
              <div>
                <ErrorMessage
                  name={`prepTime`}
                  component="div"
                  style={styles.fieldError}
                />
              </div>
              <Field
                style={styles.input}
                name="cookTime"
                placeholder="Cook Time"
                type="text"
              />
              <div>
                <ErrorMessage
                  name={`cookTime`}
                  component="div"
                  style={styles.fieldError}
                />
              </div>
              <Field
                style={styles.input}
                name="servings"
                placeholder="Servings"
                type="text"
              />
              <div>
                <ErrorMessage
                  name={`servings`}
                  component="div"
                  style={styles.fieldError}
                />
              </div>
            </div>
          </div>
          <div style={styles.section}>
            <FieldArray name="ingredients">
              {({ remove, push }) => (
                <div>
                  <h1 style={styles.subheading}>Add Ingredients</h1>
                  {values.ingredients.length > 0 &&
                    values.ingredients.map((ingredient, index) => (
                      <div key={index} style={{...styles.fieldsHorizontal, gridTemplateColumns: "120px 120px 120px 120px 180px 120px"}}>
                        <Field
                          style={styles.input}
                          name={`ingredients.${index}.id`}
                          placeholder="ID"
                          type="text"
                        />
                        <div>
                          <ErrorMessage
                            name={`ingredients.${index}.id`}
                            component="div"
                            style={styles.fieldError}
                          />
                        </div>
                        <Field
                          style={styles.input}
                          name={`ingredients.${index}.name`}
                          placeholder="Name"
                          type="text"
                        />
                        <div>
                          <ErrorMessage
                            name={`ingredients.${index}.name`}
                            component="div"
                            style={styles.fieldError}
                          />
                        </div>
                        <Field
                          style={styles.input}
                          name={`ingredients.${index}.quantity.numerator`}
                          placeholder="Numerator"
                          type="text"
                        />
                        <div>
                          <ErrorMessage
                            name={`ingredients.${index}.quantity.numerator`}
                            component="div"
                            style={styles.fieldError}
                          />
                        </div>
                        <Field
                          style={styles.input}
                          name={`ingredients.${index}.quantity.denominator`}
                          placeholder="Denominator"
                          type="text"
                        />
                        <div>
                          <ErrorMessage
                            name={`ingredients.${index}.quantity.denominator`}
                            component="div"
                            style={styles.fieldError}
                          />
                        </div>
                        <Field
                          as="select"
                          style={styles.input}
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
                            style={styles.fieldError}
                          />
                        </div>
                        <button
                          style={styles.removeButton}
                          type="button"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  <button
                    style={styles.addButton}
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
                    Add ingredient
                  </button>
                </div>
              )}
            </FieldArray>
            {/* <ErrorMessage
              name="ingredients"
              component="div"
              style={styles.fieldError}
            /> */}
          </div>
          <div style={styles.section}>
            <FieldArray name="directions">
              {({ remove, push }) => (
                <div>
                  <h1 style={styles.subheading}>Add Steps to cook</h1>
                  {values.directions.length > 0 &&
                    values.directions.map((step, index) => (
                      <div
                        key={index}
                        style={styles.listEditor}
                      >
                        <label
                          htmlFor={`directions.${index}`}
                          style={styles.stepLabel}
                        >
                          Step {index + 1}
                        </label>
                        <div style={{...styles.fieldsHorizontal, gridTemplateRows: "1fr 30px"}}>
                          <Field
                            as="textarea"
                            style={styles.longText}
                            name={`directions.${index}`}
                            placeholder="Describe the step..."
                            type="text"
                          />
                          <div>
                            <ErrorMessage
                              name={`directions.${index}`}
                              component="div"
                              style={styles.fieldError}
                            />
                          </div>
                          <button
                            style={styles.removeButton}
                            type="button"
                            onClick={() => remove(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  <button
                    style={styles.addButton}
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
              style={styles.fieldError}
            />
          </div>
          <div style={styles.section}>
            <h1 htmlFor="notes" style={styles.subheading}>
              Notes
            </h1>
            <div style={styles.fieldsHorizontal}>
              <Field
                as="textarea"
                name="notes"
                placeholder="Add any additional notes here..."
                style={styles.longText}
              />
            </div>
          </div>

          <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
};

const styles = {
  stepLabel: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#000000",
    marginBottom: "5px",
    display: "block",
  },

  formContainer: {
    maxWidth: "900px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#636d73",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(63, 50, 50, 0.1)",
  },

  section: {
    marginBottom: "30px",
  },

  title: {
    textAlign: "center",
    fontSize: "30px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },

  subheading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    marginTop: "0",
    marginBottom: "10px",
  },

  fieldsHorizontal: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 1fr)",
    gridTemplateRows: "1fr 30px",
    gridAutoFlow: "column",
    columnGap: "20px",
  },

  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },

  longText: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.2s",
    resize: "vertical",
  },

  inputFocus: {
    borderColor: "#007bff",
    boxShadow: "0 0 5px rgba(0, 123, 255, 0.3)",
  },

  fieldError: {
    color: "lightsalmon",
  },

  button: {
    padding: "10px 15px",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
  },

  addButton: {
    backgroundColor: "#28a745",
    color: "#fff",
  },

  removeButton: {
    width: "fit-content",
    backgroundColor: "#dc3545",
    color: "#fff",
  },

  submitButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
  },

};

export { RecipeForm, DEFAULT_VALUES} ;
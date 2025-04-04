import { React} from "react";
import { Formik, Field, Form, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialValues = {
  steps: [
    {
      step: "",
    },
  ],
  ingredients: [
    {
      ingredient: "",
      quantity: "",
      unit: "",
    },
  ],
  name: "" ,
  prepTime: "",
  cookTime: "",
  totalTime: "",
  servings: "", 
};

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


const RecipeSubmit = () => (
  <div style={styles.formContainer}>
    <h1 style={styles.title}>Add a new recipe</h1>
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={async (values , {setSubmitting}) => {
        console.log("Form values:", values);
        console.log("submitted");
        setTimeout(() => {
          setSubmitting(false);
        }, 1000);
      
        if (Object.keys(values).length === 0) {
          toast.error("Please fill all required fields!", {
            position: "top-right",
            autoClose: 3000,
          });
          return;
        }
      
        toast.success("Recipe submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        
        alert(JSON.stringify(values, null, 2));
        
      }}
    >
      {({ values, handleSubmit }) => (
        <Form>
          <div className="col" style={styles.col}>
            <Field
              style={styles.recipename}
              name="name"
              placeholder="Recipe Name"
              type="text"
            />
            <ErrorMessage
              name={`name`}
              component="div"
              className="field-error"
            />
          </div>
          <div className="row" style={styles.row}>
            <div className="col" style={styles.col}>
              <Field
                style={styles.input}
                name="prepTime"
                placeholder="Preparation Time"
                type="text"
              />
              <ErrorMessage
                name={`prepTime`}
                component="div"
                className="field-error"
              />
            </div>
            <div className="col" style={styles.col}>
              <Field
                style={styles.input}
                name="cookTime"
                placeholder="Cook Time"
                type="text"
              />
              <ErrorMessage
                name={`cookTime`}
                component="div"
                className="field-error"
              />
            </div>
            <div className="col" style={styles.col}>
              <Field
                style={styles.input}
                name="totalTime"
                placeholder="Total Time"
                type="text"
              />
              <ErrorMessage
                name={`totalTime`}
                component="div"
                className="field-error"
              />
            </div>
            <div className="col" style={styles.col}>
              <Field
                style={styles.input}
                name="servings"
                placeholder="Servings"
                type="text"
              />
              <ErrorMessage
                name={`servings`}
                component="div"
                className="field-error"
              />
            </div>
          </div>
          <FieldArray name="ingredients">
            {({ remove, push }) => (
              <div>
                <h1 style={styles.subheading}>Add Ingredients</h1>
                {values.ingredients.length > 0 &&
                  values.ingredients.map((ingredient, index) => (
                    <div className="row" key={index} style={styles.row}>
                      <div className="col" style={styles.col}>
                        <label htmlFor={`ingredients.${index}.ingredient`}>
                          Ingredient {index + 1}
                        </label>
                        <Field
                          style={styles.input}
                          name={`ingredients.${index}.ingredient`}
                          placeholder="apples"
                          type="text"
                        />
                        <ErrorMessage
                          name={`ingredients.${index}.ingredient`}
                          component="div"
                          className="field-error"
                        />
                      </div>
                      <div className="col" style={styles.col}>
                        <label htmlFor={`ingredients.${index}.quantity`}>
                          Quantity
                        </label>
                        <Field
                          style={styles.input}
                          name={`ingredients.${index}.quantity`}
                          placeholder="1"
                          type="text"
                        />
                        <ErrorMessage
                          name={`ingredients.${index}.quantity`}
                          component="div"
                          className="field-error"
                        />
                      </div>
                      <div className="col" style={styles.col}>
                        <label htmlFor={`ingredients.${index}.unit`}>
                          Units
                        </label>
                        <Field
                          as="select"
                          style={styles.input}
                          name={`ingredients[${index}].unit`}
                        >
                          <option value="1" disabled> Select a Unit </option>
                          {unitOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Field>
                      </div>
                      <div className="col" style={styles.col}>
                        <button
                          style={styles.removeButton}
                          type="button"
                          className="secondary"
                          onClick={() => remove(index)}
                        >
                          remove ingredient
                        </button>
                      </div>
                    </div>
                  ))}
                <button
                  style={styles.addButton}
                  type="button"
                  className="secondary"
                  onClick={() =>
                    push({ ingredient: "", quantity: "", unit: "" })
                  }
                >
                  Add ingredient
                </button>
              </div>
            )}
          </FieldArray>

          <FieldArray name="steps">
            {({ remove, push }) => (
              <div>
                <h1 style={styles.subheading}>Add Steps to cook</h1>
                {values.steps.length > 0 &&
                  values.steps.map((step, index) => (
                    <div
                      className="stepform"
                      key={index}
                      style={styles.stepform}
                    >
                      <div style={styles.col}>
                        <label
                          htmlFor={`steps.${index}.step`}
                          style={styles.stepLabel}
                        >
                          Step {index + 1}
                        </label>
                        <Field
                          as="textarea"
                          style={styles.stepinfo}
                          name={`steps.${index}.step`}
                          placeholder="Describe the step..."
                          type="text"
                        />
                        <ErrorMessage
                          name={`steps.${index}.step`}
                          component="div"
                          className="field-error"
                        />
                      </div>
                      <button
                        style={styles.removeButton}
                        type="button"
                        className="secondary"
                        onClick={() => remove(index)}
                      >
                        remove step
                      </button>
                    </div>
                  ))}
                <button
                  style={styles.addButton}
                  type="button"
                  className="secondary"
                  onClick={() => push({ step: "" })}
                >
                  Add Step
                </button>
              </div>
            )}
          </FieldArray>

          <button type="submit" style={styles.submitButton}>
            Submit
          </button>

        </Form>
      )}
    </Formik>
  </div>
);

const styles = {
  stepLabel: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#000000",
    marginBottom: "5px",
    display: "block", // Ensures it appears above the input field
  },

  formContainer: {
    maxWidth: "900px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#636d73",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(63, 50, 50, 0.1)",
  },

  recipename: {
    justifyContent: "center",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
    marginBottom: "20px",
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
  },

  stepform: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
    marginBottom: "10px",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr 1fr auto", // 3 fields + remove button
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
    width: "100%",
  },

  col: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "end",
    width: "100%",
  },

  stepinfo: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.2s",
    fontSize: "12pt",
    height: "200px",
    width: "80%",
  },

  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  inputFocus: {
    borderColor: "#007bff",
    boxShadow: "0 0 5px rgba(0, 123, 255, 0.3)",
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
    backgroundColor: "#dc3545",
    color: "#fff",
  },
  submitButton: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default RecipeSubmit;

import { React } from "react";
import { auth } from "./firebaseConfig";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Form.css"; 

function getDefaultValues() {
  return {
    name: "",
    image: "",
    description: ""
  };
}

const validationSchema = Yup.object({
  name: Yup.string()
    .max(127, "Name must be at most 127 characters")
    .required("Required"),
  image: Yup.string()
    .url(),
  description: Yup.string().required("Required")
});

function IngredientForm({ values }) {
  return (
    <div className="form-container">
      <h1 className="form-title">Create Ingredient</h1>
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

            const response = await fetch("http://localhost:8080/ingredients/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });

            if (!response.ok) {
              toast.error("Failed to submit ingredient. Please try again.", {
                position: "top-right",
                autoClose: 3000,
              });
              return;
            }

            const result = await response.text();
            toast.success("Ingredient submitted successfully!", {
              position: "top-right",
              autoClose: 3000,
            });
            console.log("Ingredient ID:", result);
          } catch (error) {
            toast.error("An error occurred. Please try again.", {
              position: "top-right",
              autoClose: 3000,
            });
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-section">
              <h2 className="form-subheading">Ingredient Details</h2>
              <div className="fields-grid">
                <Field
                  className="form-input"
                  name="name"
                  placeholder="Ingredient Name"
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
              <div className="fields-grid">
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Describe your ingredient"
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
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Ingredient"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export { IngredientForm, getDefaultValues };
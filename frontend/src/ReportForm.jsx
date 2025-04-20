import { React } from "react";
import { auth } from "./firebaseConfig";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Form.css";

function getDefaultValues(postId, postType) {
  return {
    postId: postId,
    postType: postType,
    reason: "",
    description: ""
  };
}

const validationSchema = Yup.object({
    reason: Yup.string().trim().required('Required'),
    description: Yup.string(),
});

function ReportForm({ values, onSuccess }) {
  return (
    <>
      <h1 className="form-title">Report</h1>
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

            const response = await fetch("http://localhost:8080/reports/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            });

            if (!response.ok) {
              toast.error("Failed to submit report. Please try again.");
              return;
            }

            const result = await response.text();
            toast.success("Report submitted successfully!");

            if (onSuccess) {
              onSuccess(result);
            }
          } catch (error) {
            toast.error("An error occurred. Please try again.");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-section">
              <div className="fields-grid">
                <Field
                  className="form-input"
                  name="reason"
                  placeholder="Reason"
                  type="text"
                />
                <div>
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="field-error"
                  />
                </div>
              </div>
              <div className="fields-grid">
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Additional details"
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
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default ReportForm;
export { getDefaultValues };
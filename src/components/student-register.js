// src/components/StudentRegister.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// --- Validation schema (Yup)
const RegisterSchema = Yup.object({
  fullName: Yup.string()
    .min(3, "Name is too short")
    .max(60, "Name is too long")
    .required("Full name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile")
    .required("Phone is required"),
  grade: Yup.string().required("Select a grade"),
  board: Yup.string().required("Select a board"),
  city: Yup.string().required("City is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .matches(/[A-Z]/, "Add at least one uppercase letter")
    .matches(/[a-z]/, "Add at least one lowercase letter")
    .matches(/\d/, "Add at least one number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
  terms: Yup.boolean().oneOf([true], "You must accept the Terms"),
});

export function StudentRegister() {
  const navigate = useNavigate();
  const [serverMsg, setServerMsg] = useState(null);

  const initialValues = {
    fullName: "",
    email: "",
    phone: "",
    grade: "",
    board: "",
    city: "",
    password: "",
    confirmPassword: "",
    terms: false,
  };

  async function handleSubmit(values, { setSubmitting, resetForm }) {
    setServerMsg(null);
    try {
      // Call your API (adjust URL/body to your backend)
      await axios.post("http://localhost:3001/api/auth/register", {
        name: values.fullName,
        email: values.email,
        phone: values.phone,
        grade: values.grade,
        board: values.board,
        city: values.city,
        password: values.password,
      });

      // Optional: show a small success flash
      setServerMsg({ type: "success", text: "Registration successful! Redirecting to login…" });

      // Reset & redirect to student login
      resetForm();
      // Small delay for UX (optional)
      setTimeout(() => navigate("/studentlogin"), 800);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please try again.";
      setServerMsg({ type: "danger", text: msg });
    } finally {
      setSubmitting(false);
    }
  }

  // Helper to add Bootstrap invalid class when there’s an error & touched
  const bsInvalid = (errors, touched, name) =>
    touched[name] && errors[name] ? "is-invalid" : "";

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="h3 fw-bold mb-1">Create your student account</h1>
        <div className="text-secondary">
          Access live classes, practice sets, quizzes, and progress tracking.
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {serverMsg && (
                <div className={`alert alert-${serverMsg.type}`} role="alert">
                  {serverMsg.text}
                </div>
              )}

              <Formik
                initialValues={initialValues}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting, isValid, dirty }) => (
                  <Form noValidate>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Full Name</label>
                        <Field
                          name="fullName"
                          type="text"
                          className={`form-control ${bsInvalid(errors, touched, "fullName")}`}
                          placeholder="e.g., Ananya Sharma"
                        />
                        <ErrorMessage name="fullName" component="div" className="invalid-feedback" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <Field
                          name="email"
                          type="email"
                          className={`form-control ${bsInvalid(errors, touched, "email")}`}
                          placeholder="you@example.com"
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <Field
                          name="phone"
                          type="tel"
                          className={`form-control ${bsInvalid(errors, touched, "phone")}`}
                          placeholder="10-digit mobile"
                        />
                        <ErrorMessage name="phone" component="div" className="invalid-feedback" />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Grade/Class</label>
                        <Field
                          as="select"
                          name="grade"
                          className={`form-select ${bsInvalid(errors, touched, "grade")}`}
                        >
                          <option value="">Select grade</option>
                          {["6","7","8","9","10","11","12","UG"].map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="grade" component="div" className="invalid-feedback" />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">Board</label>
                        <Field
                          as="select"
                          name="board"
                          className={`form-select ${bsInvalid(errors, touched, "board")}`}
                        >
                          <option value="">Select board</option>
                          {["CBSE","ICSE","State","Other"].map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="board" component="div" className="invalid-feedback" />
                      </div>

                      <div className="col-md-4">
                        <label className="form-label">City</label>
                        <Field
                          name="city"
                          type="text"
                          className={`form-control ${bsInvalid(errors, touched, "city")}`}
                          placeholder="e.g., Bengaluru"
                        />
                        <ErrorMessage name="city" component="div" className="invalid-feedback" />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <Field
                          name="password"
                          type="password"
                          className={`form-control ${bsInvalid(errors, touched, "password")}`}
                          placeholder="Min 8 chars, Aa1…"
                        />
                        <ErrorMessage name="password" component="div" className="invalid-feedback" />
                        <div className="form-text">
                          Use at least 8 characters, including uppercase, lowercase, and a number.
                        </div>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Confirm Password</label>
                        <Field
                          name="confirmPassword"
                          type="password"
                          className={`form-control ${bsInvalid(errors, touched, "confirmPassword")}`}
                          placeholder="Re-enter password"
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                      </div>

                      <div className="col-12">
                        <div className="form-check">
                          <Field
                            type="checkbox"
                            name="terms"
                            id="terms"
                            className={`form-check-input ${bsInvalid(errors, touched, "terms")}`}
                          />
                          <label htmlFor="terms" className="form-check-label">
                            I agree to the <Link to="/terms">Terms & Conditions</Link> and{" "}
                            <Link to="/privacy">Privacy Policy</Link>.
                          </label>
                          <ErrorMessage name="terms" component="div" className="invalid-feedback d-block" />
                        </div>
                      </div>

                      <div className="col-12 d-grid d-sm-flex gap-2 mt-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting || !isValid || !dirty}
                        >
                          {isSubmitting ? "Registering…" : "Create Account"}
                        </button>
                        <Link to="/student-login" className="btn btn-outline-secondary">
                          Already have an account? Login
                        </Link>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          {/* Small reassurance strip */}
          <div className="text-center text-secondary small mt-3">
            By continuing, you agree to receive important account and course notifications.
          </div>
        </div>
      </div>
    </div>
  );
}

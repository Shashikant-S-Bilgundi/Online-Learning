import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const LoginSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().min(8, "Minimum 8 characters").required("Password is required"),
});

export function StudentLogin({ onLogin }) {
  const navigate = useNavigate();
  const [serverMsg, setServerMsg] = useState(null);

  const initialValues = { email: "", password: "" };

  async function handleSubmit(values, { setSubmitting }) {
    setServerMsg(null);
    try {
      const base = import.meta.env?.VITE_API_URL || "https://online-learning-backend-xi.vercel.app";
      const { data } = await axios.post(`${base}/api/auth/login`, {
        email: values.email,
        password: values.password,
      });

      if (data?.token) {
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      }

      if (data?.student) {
        localStorage.setItem("student", JSON.stringify(data.student));
      }

      onLogin?.(data.student, data.token);

      setServerMsg({ type: "success", text: "Login successful! Redirecting…" });

      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login failed. Please check your credentials.";
      setServerMsg({ type: "danger", text: msg });
    } finally {
      setSubmitting(false);
    }
  }

  const bsInvalid = (errors, touched, name) =>
    touched[name] && errors[name] ? "is-invalid" : "";

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1 className="h3 fw-bold mb-1">Student Login</h1>
        <div className="text-secondary">Access your learning dashboard and continue your progress.</div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {serverMsg && (
                <div className={`alert alert-${serverMsg.type}`} role="alert">
                  {serverMsg.text}
                </div>
              )}

              <Formik initialValues={initialValues} validationSchema={LoginSchema} onSubmit={handleSubmit}>
                {({ errors, touched, isSubmitting, isValid, dirty }) => (
                  <Form noValidate>
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">Email</label>
                        <Field
                          name="email"
                          type="email"
                          className={`form-control ${bsInvalid(errors, touched, "email")}`}
                          placeholder="you@example.com"
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Password</label>
                        <Field
                          name="password"
                          type="password"
                          className={`form-control ${bsInvalid(errors, touched, "password")}`}
                          placeholder="Enter your password"
                        />
                        <ErrorMessage name="password" component="div" className="invalid-feedback" />
                      </div>

                      <div className="col-12 d-flex justify-content-between align-items-center">
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="rememberMe" />
                          <label htmlFor="rememberMe" className="form-check-label">Remember me</label>
                        </div>
                        <Link to="/forgot-password" className="small text-decoration-none">Forgot password?</Link>
                      </div>

                      <div className="col-12 d-grid d-sm-flex gap-2 mt-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isSubmitting || !isValid || !dirty}
                        >
                          {isSubmitting ? "Logging in…" : "Login"}
                        </button>
                        <Link to="/student-register" className="btn btn-outline-secondary">Create Account</Link>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          <div className="text-center text-secondary small mt-3">
            Trouble logging in? <Link to="/contact">Contact support</Link>.
          </div>
        </div>
      </div>
    </div>
  );
}

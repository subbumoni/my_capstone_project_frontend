import { useState } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { Spinner } from "react-bootstrap";

export default function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  return (
    <div className="login-container">
      <Formik
        initialValues={{ email: "", password: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }
          if (!values.password) {
            errors.password = "Required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          fetch("https://backend-backend-1.onrender.com/users/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((response) => response.json())
            .then((result) => {
              setSubmitting(false);
              if (result.message === "Login successful") {
                navigate("/finanse"); // Replace with the page you want to navigate to after successful login
              } else {
                setLoginError(result.message);
              }
            })
            .catch(() => {
              setSubmitting(false);
              setLoginError("Error logging in. Please try again.");
            });
        }}
      >
        {({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) =>
          !isSubmitting ? (
            <form onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-body">
                  <div className="inputcontainer">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {errors.email && <p className="errors">{errors.email}</p>}
                  </div>

                  <div className="inputcontainer">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                    {errors.password && (
                      <p className="errors">{errors.password}</p>
                    )}
                  </div>

                  {loginError && <p className="errors">{loginError}</p>}

                  <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" size="lg">
                      Login
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <Spinner animation="border" role="status"></Spinner>
          )
        }
      </Formik>
    </div>
  );
}

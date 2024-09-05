import { Formik } from "formik";
import { Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigator = useNavigate();
  return (
    <div className="signup-container">
      <Formik
        initialValues={{
          email: "",
          phonenumber: "",
          password: "",
          conformpassword: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          } else if (!values.phonenumber) {
            errors.phonenumber = "required";
          } else if (values.phonenumber.length != 10) {
            errors.phonenumber = "phonenumber is invalid";
          } else if (!values.password) {
            errors.password = "Required";
          } else if (values.password != values.conformpassword) {
            errors.conformpassword = "Password doesnt match";
          }

          return errors;
        }}
        //   API Storing Area;
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          fetch("http://localhost:4000/users", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(values),
          })
            .then((response) => response.json())
            .then((result) => {
              if (result) {
                navigator("/login");
              }
              setSubmitting(false);
            })
            .catch((error) => {
              setSubmitting(false);
              console.log(error);
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

          /* and other goodies */
        }) =>
          !isSubmitting ? (
            <form onSubmit={handleSubmit}>
              <div className="card">
                <div className="card-body">
                  <div className="inputcontainer">
                    <label htmlFor="email" className="inputcontainer">
                      E-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      placeholder="Enter Your Email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {errors.email && <p className="errors">{errors.email}</p>}
                  </div>

                  <div className="inputcontainer">
                    <label htmlFor="phonenumber" className="inputcontainer">
                      Phone Number
                    </label>
                    <input
                      id="phonenumber"
                      name="phonenumber"
                      placeholder="Enter Your phonenumber"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phonenumber}
                    />

                    {errors.phonenumber && (
                      <p className="errors">{errors.phonenumber}</p>
                    )}
                  </div>

                  <div className="inputcontainer">
                    <label htmlFor="password" className="inputcontainer">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter Your Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                    />

                    {errors.password && (
                      <p className="errors">{errors.password}</p>
                    )}
                  </div>
                  <div className="inputcontainer">
                    <label htmlFor="conformpassword" className="inputcontainer">
                      Comform Password
                    </label>
                    <input
                      type="password"
                      id="conformpassword"
                      name="conformpassword"
                      placeholder="Enter Your conformPassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.conformPassword}
                    />

                    {errors.conformpassword && (
                      <p className="errors">{errors.conformpassword}</p>
                    )}
                  </div>

                  <div className="d-grid gap-2">
                    <Button type="submit" variant="primary" size="lg">
                      Signup
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

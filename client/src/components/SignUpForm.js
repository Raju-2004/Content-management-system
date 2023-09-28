import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignUpForm({ isOpen, close, onSignUpSuccess }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(false);

  const notifySuccess = (message) =>
    toast.success(message, {
      // Toast configuration for success
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const notifyError = (errorMessage) =>
    toast.warn(errorMessage, {
      // Toast configuration for errors
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginForm) {
      // Handle login form submission
      console.log("Logging in...");

      const url = "http://localhost:4000/login"; 
      const data = {
        Email: email,
        Password: password,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      try {
        const response = await fetch(url, requestOptions);
        const responseData = await response.json();

        if (!response.ok) {
          // Handle login errors
          if (responseData.error) {
            notifyError(responseData.error);
          } else {
            notifyError("An error occurred while logging in.");
          }
          setEmail("");
          setPassword("");
        } else {
          // console.log(responseData)
          localStorage.setItem('UserEmail',responseData.user.email)
          notifySuccess("Login successful!"); 
          close();
          onSignUpSuccess();
          // Handle successful login, e.g., store user info in state or cookies
          // Redirect to the desired location, e.g., dashboard
          setEmail("");
          setPassword("");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        notifyError("An error occurred while logging in.");
      }
    } else {
      // Handle sign-up form submission
      console.log("First Name:", firstName);
      console.log("Last Name:", lastName);
      console.log("Email:", email);
      console.log("Password:", password);

      const url = "http://localhost:4000/signup";

      const data = {
        fname: firstName,
        lname: lastName,
        Email: email,
        Password: password,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      try {
        const response = await fetch(url, requestOptions);
        const responseData = await response.json();

        if (!response.ok) {
          // Handle server-side errors
          if (responseData.error) {
            if (
              responseData.error ===
              "Email address is already in use. Try to login"
            ) {
              notifyError(responseData.error);
              setIsLoginForm(true);
            }
            notifyError(responseData.error);
          } else {
            notifyError("An error occurred while signing up.");
          }
        } else {
          localStorage.setItem('UserEmail',responseData.email)
          notifySuccess("Sign up successful!");
          close();
          onSignUpSuccess();
          setFirstName("");
          setLastName("");
          navigate("/dashboard");

        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        notifyError("An error occurred while signing up.");
      }
    }
  };

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    isOpen && (
      <>
        <div className="SignUpForm">
          <div className="head">
            <h2 className="heading">{isLoginForm ? "Login" : "Sign Up"}</h2>
            <div className="close" onClick={() => {close()}}>X</div>
          </div>
          <form>
            {!isLoginForm && (
              <>
                <div>
                  <label>First Name:</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label>Last Name:</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </>
            )}
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button onClick={handleSubmit} type="button">{isLoginForm ? "Login" : "Sign Up"}</button>
            or
            <button onClick={toggleForm} type="button">
              {isLoginForm ? "Switch to Sign Up" : "Switch to Login"}
            </button>
          </form>
        </div>
        <div className="modal-backdrop"></div>
      </>
    )
  );
}

export default SignUpForm;

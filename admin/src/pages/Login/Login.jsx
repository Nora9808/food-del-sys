import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import logo from "../../assets/pizzaLogo.png"; // adjust path if needed

const Login = ({ url }) => {
  //const [email, setEmail] = useState("");
  //const [password, setPassword] = useState("");
  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@example.com" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/list");
    } else {
      alert("Invalid email or password");
    }
  };

  const onLogin = async (event) => {
    event.preventDefault();

    let newUrl = url;
    if (currentState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    const response = await axios.post(newUrl, data);

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Hi-Line Pizza Admin" className="login-logo" />
        <h2 className="login-title">Admin Panel {currentState}</h2>

        <form onSubmit={onLogin}>
          {currentState === "Login" ? (
            <></>
          ) : (
            <div className="input-group">
              <input
                name="name"
                value={data.name}
                onChange={onChangeHandler}
                type="text"
                placeholder="Your name"
                required
              />
            </div>
          )}
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={data.email}
              onChange={onChangeHandler}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={data.password}
              onChange={onChangeHandler}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            {currentState}
          </button>

          <div className="login-popup-condition">
            <input type="checkbox" required />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>

          {currentState === "Login" ? (
            <p>
              Create a new account?{" "}
              <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrentState("Login")}>Login here</span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;

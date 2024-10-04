import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/Api";
import "../css/Register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      navigate("/landing");
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="left-panel">
        <h1 className="title">SnackTrack</h1>
        <p className="punchline">
          Join us and simplify your snack expense tracking!
        </p>
      </div>
      <div className="right-panel">
        <form onSubmit={handleSubmit} className="register-form">
          <h2>Create an Account</h2>
          {error && <p className="error-message">{error}</p>}
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Register</button>
          <p className="login-link">
            Already have an account? <Link to="/landing">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;

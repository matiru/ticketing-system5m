

import React from 'react';
import "./signup.css";

const Login = () => {
  return (
    <div className="container">
      <div className="logo">
        <img src="company-logo.png" alt="Company Logo" />
      </div>
      <div className="welcome-message">
        <h1>Welcome to Our Platform</h1>
        <p>Please Login to Continue</p>
      </div>
      <div className="login-form">
        <form>
          <label>Email:</label>
          <input type="email" />
          <label>Password:</label>
          <input type="password" />
          <button>Login</button>
        </form>
        <div className="signup-link">
          <a href="#">Don't have an account? Sign up here!</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
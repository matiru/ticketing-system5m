import React, { useState } from "react";
import "./LandingPage.css";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { Link } from "react-router-dom";
import  db, { auth } from "../database/firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import firebase from "firebase/compat/app";

function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetpass = (e) => {
    e.preventDefault();

    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        // Password reset email sent!
        alert("Password reset link sent!");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
      });
  };

  const signIn = (e) => {
    setLoading(true);

    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((auth) => {
        const q = query(
          collection(db, "customers"),
          where("agent", "==", false)
        );

        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            if (doc.data().email === email) {
              navigate("/customer");
            }
            //  else {
            //  window.alert("please register!");
            //  }
          });
        });
      })
      .catch((error) => alert(error.message));
    setLoading(false);
  };

  return (
    <div className="container">
    <div className="logo">
    <img
      className="login__logo"
      src=" https://avatars.dicebear.com/api/human/:matiru5810.svg"
    />
    </div>
    <div className="welcome-message">
      <h1>Welcome to Tickly</h1>
      <p>Please Login to Continue</p>
    </div>
    <div className="landingpage_body2">
              <HeadsetMicIcon />
              <h3 className="areyou">Are you an agent?</h3>
              <Link className="linelinks" to="/agent">
                <h3 className="agentloginlink"> Login here </h3>
              </Link>
            </div>
    <div className="login-form">
      <form>
        <label>Email:</label>
        <input type="email"
            className="input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
        <label>Password:</label>
        <input type="password" 
           placeholder="Enter your password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}/>
        <button onClick={signIn}>Login</button>
         <p className=" forgotpassword" onClick={resetpass}>
                  forgot password?
                </p>
      </form>
      <div className="signup-link">
  
        <Link to="/signup" className="linksignup1">
        <a >Don't have an account? Sign up here!</a>
                </Link>
      </div>
      
      
    </div>
  </div>
  );
}

export default LandingPage;

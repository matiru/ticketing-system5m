import React, { useState } from "react";
import "./LandingPage.css";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import db, { auth } from "../src/database/firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import firebase from "firebase/compat/app";

function AgentLogin() {
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
        const q = query(collection(db, "agents"), where("agent", "==", true));

        getDocs(q).then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            if (doc.data().email === email) {
              navigate("/agentdashboard");
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
    <div className="landingpage">
      <div className="landingpage_header">
        <div className="landingpage_header1">
          <div className="landingpage_header11">
            <Avatar src="https://avatars.dicebear.com/api/human/:matiru5810.svg" />
            <h1>TickLy</h1>
          </div>
          <Link to="/admin" className="linelinks">
            <span className="linksignup">admin</span>
          </Link>
        </div>
        <div className="landingpage_header2">
          <h3>Welcome To TickLy</h3>
        </div>
      </div>
      <div className="landingpage_bodyframe_signup">
        <div className="landingpage_body_signup">
          <div className="landingpage_body1_signup">
            <h1>Agent Sign-in</h1>
            <form className="credentials">
              <h5></h5>
              <input
                className="input"
                placeholder="Enter your email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <h5></h5>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Link className="linelinks">
                <p className=" forgotpassword" onClick={resetpass}>
                  forgot password?
                </p>
              </Link>
              <div className="button_container1">
                <button className="signInButton" type="submit" onClick={signIn}>
                  sign in
                </button>
              </div>
            </form>
            <div className="landingpage_body2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentLogin;

import React, { useState } from "react";
import "./adminlogin.css";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import  db, { auth } from "../database/firebase";
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
  <div className="admin-landingpage">
  <div className="n1">
  <div className="admin-landingpage-header">
    <div className="admin-landingpage_header1">
      <div className="admin-landingpage_header11">
        <Avatar src="https://avatars.dicebear.com/api/human/:matiru5810.svg" />
        <h1>TickLy</h1>
      </div>
      <Link to="/admin" className="admin-linelinks">
        <span className="linksignup">admin</span>
      </Link>
    </div>
    <div className="admin-landingpage-header2">
      <h3>Welcome To TickLy</h3>
    </div>
  </div>
  <div className="admin-landingpage_bodyframe_signup">
    <div className="admin-landingpage_body_signup">
      <div className="admin-landingpage_body1_signup">
        <h1>Agent Sign-in</h1>
        <form className="admin-credentials">
          <h5></h5>
          <input
            className="input-admin"
            placeholder="Enter your email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <h5></h5>
          <input
            className="input-admin"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link className="admin-linelinks">
            <p className=" forgotpassword" onClick={resetpass}>
              forgot password?
            </p>
          </Link>
          <div className="admin-button_container1">
            <button className="admin-signInButton" type="submit" onClick={signIn}>
              sign in
            </button>
          </div>
        </form>
        <div className="admin-landingpage_body2"></div>
      </div>
    </div>
  </div>
</div>
</div>
  );
}

export default AgentLogin;

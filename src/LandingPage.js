import React, { useState } from "react";
import "./LandingPage.css";
import { Avatar } from "@mui/material";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { Link } from "react-router-dom";
import db, { auth } from "../src/database/firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
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
    <div className="landingpage">
      <div className="landingpage_header">
        <div className="landingpage_header1">
          <div className="landingpage_header11">
            <Avatar src="https://avatars.dicebear.com/api/human/:matiru5810.svg" />
            <h1>TickLy</h1>
          </div>
          <Link to="/signup" className="linelinks">
            <span className="linksignup">SignUp</span>
          </Link>
        </div>
        <div className="landingpage_header2">
          <h3>Welcome To TickLy</h3>
        </div>
      </div>
      <div className="landingpage_bodyframe">
        <div className="landingpage_body">
          <div className="landingpage_body1">
            <h1>Login to your account</h1>
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
              <button className="signInButton" type="submit" onClick={signIn}>
                Sign In
              </button>
            </form>
            <div className="landingpage_body2">
              <HeadsetMicIcon />
              <h3 className="areyou">Are you an agent?</h3>
              <Link className="linelinks" to="/agent">
                <h3 className="agentloginlink"> Login here </h3>
              </Link>
            </div>
          </div>
          <div className="landingpage_body3">
            <div className="landingpage_body4">
              <h1>Don't have an account?</h1>
            </div>
            <div className="landingpage_body5">
              <h2>Sign Up </h2>
              <span>
                <Link to="/signup" className="linksignup1">
                  SIGN UP WITH US
                </Link>
              </span>
            </div>
            <div className="landingpage_body6">
              <p>
                Once you sign up, you will have complete access to our service
                portal and you can use your account to raise tickets and
                communicate with our agents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

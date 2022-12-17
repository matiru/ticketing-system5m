import React, { useState } from "react";
import "./Login1.css";
import { Link } from "react-router-dom";
import db, { auth } from "../src/database/firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import{ sendPasswordResetEmail }from "firebase/auth";
import firebase from "firebase/compat/app";


function Login1() {
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




 const signIn= (e) => {
    setLoading(true);

   e.preventDefault();
   auth
     .signInWithEmailAndPassword(email, password)
     .then((auth) => {
       const q = query(collection(db, "customers"), where("agent", "==", false));

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
    <div className=" loginpage">
      <div className="loginagent">
        <Link to="/cus1" className="create_account">
          <span className="linkagent">Login as Agent</span>
        </Link>
      </div>
      <div className="login">
        <img
          className="login__logo"
          src=" https://avatars.dicebear.com/api/human/:matiru5810.svg"
        />
        <h1> Welcome To Tickly</h1>

        <div className="login__container">
          <h1>Sign-in</h1>

          <form>
            <h5>E-mail</h5>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <h5>Password</h5>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              onClick={signIn}
              disabled={loading}
              className="login__signInButton"
            >
              Sign In
            </button>
            <Link>
              <p onClick={resetpass}> forgot password!</p>
            </Link>
          </form>

          <p>Don't have an account? Click create!</p>
          <span className="linkagent">
            <Link to="/cus2" className="create_account">
              create your Tickly Account
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login1;

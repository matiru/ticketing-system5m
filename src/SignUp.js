import React, { useState } from "react";
import "./signup.css";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import db, { auth } from "../src/database/firebase";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import firebase from "firebase/compat/app";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

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

  const register = async (event) => {
    event.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName: username });
      const user = res.user;
      await addDoc(collection(db, "customers"), {
        uid: user.uid,
        agent: false,
        username: username,
        authProvider: "local",
        email,
      });
      window.alert("account successfully created");
      // .then((result) => {
      //   dispatch({
      //     type: actionTypes.SET_USER,
      //     user: result.user,
      //   });
      // })
    } catch (err) {
      console.error(err);
      alert(err.message);
    }

    setEmail("");
    setPassword("");
    setUsername("");
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
    <div className="login">
    <Link to="/" className="backheader_link">
    <ArrowCircleLeftOutlinedIcon className="back_button" />
      SIGN-IN
     
    </Link>
    <img
      className="login__logo"
      src=" https://avatars.dicebear.com/api/human/:matiru5810.svg"
    />

    <div className="login__container">
      <h1>Create Account</h1>

      <form>
        <h5>E-mail</h5>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <h5>Username</h5>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <h5>Password</h5>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          onClick={register}
          className="login__signInButton"
        >
          Create Account
        </button>
      </form>

      <p></p>
    </div>
  </div>
  );
}

export default SignUp;


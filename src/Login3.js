import React, { useState } from "react";
import "./Login1.css";
import { Link } from "react-router-dom";
import db, { auth } from "../src/database/firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

function Login3() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

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
      })
       window.alert("successfully created");
      // .then((result) => {
      //   dispatch({
      //     type: actionTypes.SET_USER,
      //     user: result.user,
      //   });
  // })
    } 
   

    catch (err) {
      console.error(err);
      alert(err.message);
    }

    setEmail("");
    setPassword("");
    setUsername("");


  };
  
  // const signIn = (e) => {
  //   e.preventDefault();

  //   auth
  //     .signInWithEmailAndPassword(email, password)
  //     .then((auth) => {
  //       navigate("/customer");
  //     })
  //     .catch((error) => alert(error.message));
  // };

  //   const register = (e) => {
  //     e.preventDefault();

  //     auth
  //       .createUserWithEmailAndPassword(email, password)
  //       .then((auth) => {
  //         // it successfully created a new user with email and password
  //         if (auth) {
  //             navigate("/super");

  //         }
  //       })
  //       .catch((error) => alert(error.message));
  //   };

  return (
  <div className=" loginpage">
      <div className="loginagent">
        <Link to="/" className="create_account">
          <span className="linkagent">
         Login as client
          </span>
        </Link>
      </div>
    <div className="login">
      <img
        className="login__logo"
        src=" https://avatars.dicebear.com/api/human/:matiru5810.svg"
      />
      <h1> Welcome To Tickly</h1>

      <div className="login__container">
        <h1>Create New Account</h1>

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

        {/* <button onClick={signIn} className="login__registerButton">
          Sign In
        </button> */}
      </div>
    </div>
    </div>
  );
}

export default Login3;

import React, { useState } from "react";
import "./AddAgent.css";
import { Link } from "react-router-dom";
import db, { auth } from "../database/firebase";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";

function AddAgent() {
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
      await addDoc(collection(db, "agents"), {
        uid: user.uid,
        agent: true,
        username: username,
        authProvider: "local",
        role: "Agent",
        email,
        isActive: true,

      });
      window.alert("account successfully created")
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
    // clear the form
    setEmail("");
    setPassword("");
    setUsername("");
  };

  return (
    <div className="login">
      <Link to="/adminagent" className="backheader_link">
        <ArrowCircleLeftOutlinedIcon className="back_button" />
      </Link>
      <img
        className="login__logo"
        src=" https://avatars.dicebear.com/api/human/:matiru5810.svg"
      />

      <div className="login__container">
        <h1>Create Agent</h1>

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

export default AddAgent;

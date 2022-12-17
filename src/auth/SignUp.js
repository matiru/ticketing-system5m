import React, { useState ,useEffect} from "react";
import "./Login.css";
import { useStateValue } from "../Redux/StateProvider";
import { actionTypes } from "../Redux/reducer";
import db, { auth, provider } from "../database/firebase";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { getDocs, query,where} from "firebase/firestore";

function SignUp() {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const signup = async (event) => {
    event.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName: username });
      const user = res.user;
      await addDoc(collection(db, "customers"), {
        uid: user.uid,
        agent:false,
        username: username,
        authProvider: "local",
        email,
      });
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
  }

  // // const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const login = (e) => {
   e.preventDefault();
   auth
     .signInWithEmailAndPassword(email, password)
     .then((auth) => {
       const q = query(collection(db, "agents"), where("agent", "==", true));

       getDocs(q).then((querySnapshot) => {
         querySnapshot.forEach((doc) => {
           console.log(doc.id, " => ", doc.data());
           if (doc.data().email === email) {
             navigate("/super");
           } else {
             navigate("/customer");
           }
         });
       });
     })
     .catch((error) => alert(error.message));
 }
 
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: "SET_USER",
          uid: authUser.uid,
          user: authUser,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
      

  return (
    <div className="login">
      <img
        className="login_logo "
        src=" https://avatars.dicebear.com/api/human/:matiru5810.svg"
      />
      <h1> Welcome To Tickly</h1>
      <div className="login_container">
        <h1>Create Account</h1>
        <form>
          <h5>username</h5>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            type="text"
          />
          <h5>Email</h5>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
          />
          <h5>Password</h5>

          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
          />
          <button onClick={signup} className="login_signUp_button">
            create your Tickly Account
          </button>
        </form>
        <p></p>

        <button onClick={login} type="submit" className="login_signIn_button">
          Sign In
        </button>
      </div>
    </div>
  );
}
export default SignUp;

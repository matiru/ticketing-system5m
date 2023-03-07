import React ,{useState,useEffect} from 'react'
import "./Profile.css"
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { Link } from "react-router-dom";
import { db } from "../database/firebase";
import Profile_info from "./Profile_info";
import { useStateValue } from "../Redux/StateProvider";
import firebase from "firebase/compat/app";


function Profile() {
  const [username, setUsername] = useState("");
  const [agents, setAgents] = useState([]);
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");




  const [{ user }, dispatch] = useStateValue();

  // useEffect(() => {
  //   db.collection("agents")

  //     .where("email", "==", user.email)
  //     .onSnapshot((snapshot) => {
  //       console.log(snapshot.docs.map((doc) => doc.data().agent));
  //       setAgents(
  //         snapshot.docs.map((doc) => ({
  //           uid: user.uid,
  //           id: doc.id,
  //           data: doc.data(),
  //         }))
  //       );
  //     });
  // }, []);

  useEffect(() => {
    db.collection("agents")
      .where("email", "==", user.email)
      .get()
      .then((querySnapshot) => {
        setAgents(
          querySnapshot.docs.map((doc) => ({
            uid: user.uid,
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
  }, []);
  

 

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

 

  const updatePhone = (e) => {
    e.preventDefault();
    firebase
      .firestore()
      .collection("agents")
      .where("uid", "==", user.uid)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          console.log(doc.id, " => ", doc.data());
          doc.ref.update({ telephone: telephone }); //not doc.update({foo: "bar"})
        });
      });
    setTelephone("");
  };

  
const updateUsername = (e) => {
  e.preventDefault();
  firebase
    .firestore()
    .collection("agents")
    .where("uid", "==", user.uid)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        console.log(doc.id, " => ", doc.data());
        doc.ref.update({ username: username }); //not doc.update({foo: "bar"})
      });
    });
  setUsername("");
};


  return (
    <div className="profilepage">
      <Link to="/agentdashboard">
        <ArrowCircleLeftOutlinedIcon className="back_button" />
      </Link>

      {agents.map((agent) => (
        <Profile_info
          key={agent.id}
          // open={ticket.data.open}
          id={agent.id}
          name={agent.data.username}
          email={agent.data.email}
          telephone={agent.data.telephone}
          role={agent.data.role}
        />
      ))}

      <div className="updatedetails">
        <form>
          <div className="update_form">
            <h5>name: </h5>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter new Name"
              type="text"
              maxLength="70"
            />
            <button className="updatebtn" onClick={updateUsername}>
              update
            </button>
          </div>
        </form>

        <form>
          <div className="update_form">
            <h5>phone: </h5>
            <input
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="Enter New Phone "
              type="text"
              maxLength="70"
            />
            <button className="updatebtn" onClick={updatePhone}>
              update
            </button>
          </div>
        </form>
        <form>
          <div className="update_form">
            <h5>ResetPassword: </h5>
            <input
              value={email}
              placeholder="Enter Email "
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              maxLength="70"
            />
            <button className="updatebtn" onClick={resetpass}>
              ResetPassword
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile
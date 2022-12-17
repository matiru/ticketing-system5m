import React, { useState, useEffect } from "react";
import { db } from "../database/firebase";
import "../admin/Profile.css";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { Link } from "react-router-dom";
import Profile_info1 from "./Profile_info1";
import { useStateValue } from "../Redux/StateProvider";
import firebase from "firebase/compat/app";
import {where } from 'firebase/firestore';


function Profile1({id}) {
  const [customers, setCustomers] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");

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

  useEffect(() => {
    db.collection("customers")

      .where("email", "==", user.email)
      .onSnapshot((snapshot) => {
        console.log(snapshot.docs.map((doc) => doc.data().customer));
        setCustomers(
          snapshot.docs.map((doc) => ({
            uid: user.uid,
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
  }, []);

const updatePhone = (e) => {
  e.preventDefault();
 firebase
   .firestore()
   .collection("customers")
   .where("uid", "==", user.uid)
   .get()
   .then(function (querySnapshot) {
     querySnapshot.forEach(function (doc) {
       console.log(doc.id, " => ", doc.data());
       doc.ref.update({telephone:telephone }); //not doc.update({foo: "bar"})
     });
   });
   setTelephone("")
};


const updateUsername = (e) => {
  e.preventDefault();
  firebase
    .firestore()
    .collection("customers")
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
      <Link to="/customer">
        <ArrowCircleLeftOutlinedIcon className="back_button" />
      </Link>

      {customers.map((customer) => (
        <Profile_info1
          key={customer.id}
          // open={ticket.data.open}
          id={customer.id}
          name={customer.data.username}
          email={customer.data.email}
          telephone={customer.data.telephone}
          role={customer.data.role}
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

export default Profile1;

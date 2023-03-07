import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import "./SuperAgent.css";
import { Link, Outlet } from "react-router-dom";
import { useStateValue } from "../Redux/StateProvider";
import { auth, db } from "../database/firebase";
import { useNavigate } from "react-router-dom";



function SuperAgent() {

  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
      navigate("/");
    }
  };

  // useEffect(() => {
  //   db.collection("tickets")
  //     .where("agent", "==", user.email)
  //     .where("status", "==", "open")   
  //     .onSnapshot((snapshot) => {
  //       tickets.sort((a, b) => {
  //         return a.data.timestamp.seconds - b.data.timestamp.seconds;
  //       });
        
  //       console.log(snapshot.docs.map((doc) => doc.data().ticket));
  //       setTickets(
  //         snapshot.docs.map((doc) => ({
  //           uid: user.uid,
  //           id: doc.id,
  //           data: doc.data(),
  //         }))
  //       );
  //     });
  // }, []);
  // useEffect(() => {
  //   const openQuery = db.collection("tickets").where("agent", "==", user.email).where("status", "==", "open");
  //   const inProgressQuery = db.collection("tickets").where("agent", "==", user.email).where("status", "==", "In progress");
    
  //   Promise.all([openQuery.get(), inProgressQuery.get()])
  //     .then((querySnapshots) => {
  //       const ticketData = [];
  //       querySnapshots.forEach((querySnapshot) => {
  //         querySnapshot.forEach((doc) => {
  //           ticketData.push({
  //             uid: user.uid,
  //             id: doc.id,
  //             data: doc.data(),
  //           });
  //         });
  //       });
  //       setTickets(ticketData);
  //     })
  //     .catch((error) => {
  //       console.log("Error getting tickets: ", error);
  //     });
  // });
  

  return (
    <div className="agentdashboard">
      <div className="agentdashboard_sidebar">
        <div className="agentdashboard_sidebar_header">
          <Avatar src="https://avatars.dicebear.com/api/human/:matiru5810.svg" />
          <h3>{user.email}</h3>
        </div>
        <div className="sidebar">
          <div className="button_container">
            <Link to="profile" className="header_link">
              <span className="span_tickets">
                <h2>My Profile</h2>
              </span>
            </Link>
          </div>
          <div className="button_container">
            <Link to="opentickets" className="header_link">
              <span className="span_tickets">
              <h2>Open Tickets</h2>
              </span>
            </Link>
          </div>
          <div className="button_container">
            <Link to="closedtickets"className="header_link">
              <span className="span_tickets">
              <h2>Closed Tickets</h2>
              </span>
            </Link>
          </div>
          <div className="button_container">
            <Link to="report" className="header_link">
              <span className="span_tickets">
              <h2>Report</h2>
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="agentdashboard_tickets">
        <div className="agentdashboard_tickets_header">
          <div className=" agentdashboard_tickets_header_heading">
            <h1>{new Date().toLocaleString()}</h1>

            <span onClick={handleAuthenticaton} className="linkagent">
              {user ? "Sign Out" : "Sign In"}
            </span>
          </div>
          <div className=" agentdashboard_tickets_header_title">
            <h2>Open Tickets</h2>
          </div>
        </div>
        <Outlet />
    
      </div>
    </div>
  );
}

export default SuperAgent;

import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import "./SuperAgent.css";
import Ticket_infoa from "../customers/Ticket_infoa";
import { Link } from "react-router-dom";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { useStateValue } from "../Redux/StateProvider";
import { auth, db } from "../database/firebase";
import { useNavigate } from "react-router-dom";



function SuperAgent() {
  const [tickets, setTickets] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
      navigate("/");
    }
  };

  useEffect(() => {
    db.collection("tickets")
      .where("agent", "==", user.email)
      // .where("status", "==", "open")   
      .onSnapshot((snapshot) => {
        tickets.sort((a, b) => {
          return a.data.timestamp.seconds - b.data.timestamp.seconds;
        });
        
        console.log(snapshot.docs.map((doc) => doc.data().ticket));
        setTickets(
          snapshot.docs.map((doc) => ({
            uid: user.uid,
            id: doc.id,
            data: doc.data(),
          }))
          //   .orderBy("timestamp", "desc")
        );
      });
  }, []);

  

  return (
    <div className="agentdashboard">
      <div className="agentdashboard_sidebar">
        <div className="agentdashboard_sidebar_header">
          <Avatar src="https://avatars.dicebear.com/api/human/:matiru5810.svg" />
          <h3>{user.email}</h3>
        </div>
        <div className="agentdashboard_sidebar_nav">
        <div className="button_container">
            <Link to="progressedtickets" className="header_link">
              <span className="span_tickets">
                <h2>Tickets In Progress</h2>
              </span>
            </Link>
          </div>
          <div className="button_container">
            <Link to="closedtickets" className="header_link">
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
          <div className="button_container">
            <Link to="profile" className="header_link">
              <span className="span_tickets">
                <h2>My profile</h2>
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
            <h2>Total Open Tickets:{tickets.length}</h2>

            {/* <div className="button_wrap">
              <button className="tickets_open">open tickets</button>
              <button className="tickets_closed"> closed tickets</button>
            </div> */}
          </div>
        </div>
        <div className="agentdashboard_tickets_ticketsdisplay">
          {tickets.map((ticket) => (
            <Ticket_infoa
              key={ticket.id}
              id={ticket.id}
              assigned={ticket.data.assigned}
              status={ticket.data.status}
              agent={ticket.data.agent}
              subject={ticket.data.subject}
              description={ticket.data.description}
              timestamp={ticket.data.timestamp}
              customer={ticket.data.customer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SuperAgent;

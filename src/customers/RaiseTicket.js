import React, { useState,useEffect } from "react";
import "./RaiseTicket.css";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../database/firebase";
import { useStateValue } from "../Redux/StateProvider";
import {query, limit, getDocs, updateDoc,getCountFromServer , where,doc} from 'firebase/firestore';
import "firebase/compat/firestore";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";


function RaiseTicket({ id }) {

    const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();

  const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
      navigate("/");
    }
  };

  const [tickets1, setTickets1] = useState([]);
  const [isCountAccessed, setIsCountAccessed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const ticketData = await db.collection("tickets")
        .where("customer", "==", user.email)
        .get();
      setTickets1(ticketData.docs.map((doc) => doc.data()));
    };
    fetchData();
  }, );

  const countTicketsByCategory = () => {
    const ticketCounts = { open: 0, "In progress": 0, closed: 0, pending: 0 };
    tickets1.forEach((ticket) => {
      ticketCounts[ticket.status] += 1;
    });
    return Object.entries(ticketCounts).map(([category, count]) => ({
      category,
      count,
    }));
  };

  const ticketCounts = countTicketsByCategory();




























































  return (
    <div className="raiseticket">
      <div className="raiseticket_header">
        <h1>Hello welcome {user.email}</h1>

        <span onClick={handleAuthenticaton} className="linkagent1">
          {user ? "Sign Out" : "Sign In"}
        </span>
      </div>
      <div className="raiseticket_footer">
      <div className="sidebar">
      <div className="button_container">
        <Link to="createticket" className="header_link">
          <span className="span_tickets">
            <h2>Create Ticket</h2>
          </span>
        </Link>
      </div>

      <div className="button_container">
        <Link to="profile" className="header_link">
          <span className="span_tickets">
            <h2>My Profile</h2>
          </span>
        </Link>
      </div>

      <div className="button_container">
        <Link to="pendingtickets" className="header_link">
          <span
            className="span_tickets"
            style={{
              backgroundColor:
                ticketCounts.find((t) => t.category === "pending").count > 0
                  ? "yellow"
                  : "inherit",
              animation:
                !isCountAccessed && ticketCounts.find((t) => t.category === "pending").count > 0
                  ? "blinking 1000ms infinite"
                  : "none",
            }}
            onClick={() => setIsCountAccessed(true)}
          >
            <h2>My Pending Tickets</h2>
            <span>{ticketCounts.find((t) => t.category === "pending").count}</span>
          </span>
        </Link>
      </div>

      <div className="button_container">
        <Link to="opentickets" className="header_link">
          <span
            className="span_tickets"
            style={{
              backgroundColor:
                ticketCounts.find((t) => t.category === "open").count > 0
                  ? "pink"
                  : "inherit",
              animation:
                !isCountAccessed && ticketCounts.find((t) => t.category === "open").count > 0
                  ? "blinking 1000ms infinite"
                  : "none",
            }}
            onClick={() => setIsCountAccessed(true)}
          >
            <h2>My Open Tickets</h2>
            <span>{ticketCounts.find((t) => t.category === "open").count}</span>
          </span>
        </Link>
      </div>


      <div className="button_container">
        <Link to="progressedtickets" className="header_link">
          <span
            className="span_tickets"
            style={{
              backgroundColor:
                ticketCounts.find((t) => t.category === "In progress").count > 0
                  ? "lightgreen"
                  : "inherit",
            }}
          >
            <h2>Tickets In Progress</h2>
            <span>{ticketCounts.find((t) => t.category === "In progress").count}</span>
          </span>
        </Link>
      </div>
      <div className="button_container">
        <Link to="closedtickets" className="header_link">
          <span
            className="span_tickets"
            style={{
              backgroundColor:
                ticketCounts.find((t) => t.category === "closed").count > 0
                  ? "lightblue"
                  : "inherit",
            }}
          >
            <h2>My Closed Tickets</h2>
            <span>{ticketCounts.find((t) => t.category === "closed").count}</span>
          </span>
        </Link>
      </div>
    </div>
    <Outlet />

      </div>
    </div>
  );
}

export default RaiseTicket;

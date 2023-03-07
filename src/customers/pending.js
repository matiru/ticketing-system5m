import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ClientTickets.css";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { db } from "../database/firebase";
import Ticket_infoa from "./Ticket_infoa";
import { useStateValue } from "../Redux/StateProvider";
//import { query, collection, onSnapshot } from "firebase/firestore";

function PendingTickets() {
  const [tickets, setTickets] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  useEffect(() => {
     db.collection("tickets")
      .where("customer", "==", user.email)
      .where("status", "==", "pending")
      .get()
      .then((snapshot) => {
        setTickets(
          snapshot.docs.map((doc) => ({
            uid: user.uid,
            id: doc.id,
            data: doc.data(),
          }))
        );
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  
   
  },[] );
  
  tickets.sort((a, b) => {
    return a.data.timestamp.seconds - b.data.timestamp.seconds;
  });

  return (
    <div className="client_tickets">
      <div className="agentdashboard_tickets_ticketsdisplay">
        <div className="clients_tickets_display">
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
              date={ticket.data.date}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PendingTickets;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../customers/ClientTickets.css";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { db } from "../database/firebase";
import { useStateValue } from "../Redux/StateProvider";
import Ticket_infoa1 from "../customers/Ticket_infoa1";
//import { query, collection, onSnapshot } from "firebase/firestore";

function ClientsOpenTickets() {
  const [tickets, setTickets] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    db.collection("tickets")
      .where("status", "==", "open")
      .get()
      .then((querySnapshot) => {
        const sortedTickets = querySnapshot.docs.sort((a, b) => {
          return a.data().timestamp.seconds - b.data().timestamp.seconds;
        });
        const tickets = sortedTickets.map((doc) => ({
          uid: user.uid,
          id: doc.id,
          data: doc.data(),
        }));
        setTickets(tickets);
      })
      .catch((error) => {
        console.log("Error getting closed tickets: ", error);
      });
  });
  
  

  
  tickets.sort((a, b) => {
    return a.data.timestamp.seconds - b.data.timestamp.seconds;
  });
  return (
    <div className="client_tickets">
    <div className="agentdashboard_tickets_ticketsdisplay">
    
          {tickets.map((ticket) => (
            <Ticket_infoa1
              key={ticket.id}
              // open={ticket.data.open}
              id={ticket.id}
              assigned={ticket.data.assigned}
              status={ticket.data.status}
              agent={ticket.data.agent}
              description={ticket.data.description}
              subject={ticket.data.subject}
              timestamp={ticket.data.timestamp}
              customer={ticket.data.customer}
              date={ticket.data.date}
            />
          ))}
        </div>
      </div>
    
  );
}

export default  ClientsOpenTickets;

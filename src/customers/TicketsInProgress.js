import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { db } from "../database/firebase";
import Ticket_infoa3 from "./Tickets_infoa3";
import { useStateValue } from "../Redux/StateProvider";
//import { query, collection, onSnapshot } from "firebase/firestore";

function TicketsInProgress() {
  const [tickets, setTickets] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  
  useEffect(() => {
    db.collection("tickets")
      .where("customer", "==", user.email)
      .where("status", "==", "In progress")
      // order by timestamp
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
        );
      });
  }, []);

  return (
    <div className="client_tickets">
      <div className="client_tickets_header">
        <Link to="/customer" className="backheader_link">
          <ArrowCircleLeftOutlinedIcon className="back_button" />
        </Link>
        <div className="clients_tickets_header_title">
          {tickets?.length === 0 ? (
            <h2>You have no open tickets 😢</h2>
          ) : (
            <h3>My Open Tickets: {tickets.length} </h3>
          )}
          {/* <h3>My tickets:</h3> */}
        </div>

        <div className="clients_tickets_display">
          {tickets.map((ticket) => (
            <Ticket_infoa3
              key={ticket.id}
              // open={ticket.data.open}
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

export default TicketsInProgress;

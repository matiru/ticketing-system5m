import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { db } from "../database/firebase";
import Ticket_infoa3 from "./Tickets_infoa3";
import { useStateValue } from "../Redux/StateProvider";

function TicketsInProgress() {
  const [tickets, setTickets] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  
  // useEffect(() => {
  //   db.collection("tickets")
  //     .where("customer", "==", user.email)
  //     .where("status", "==", "In progress")
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

  useEffect(() => {
    db.collection("tickets")
      .where("customer", "==", user.email)
      .where("status", "==", "In progress")
      .get()
      .then((snapshot) => {
        const ticketData = snapshot.docs.map((doc) => ({
          uid: user.uid,
          id: doc.id,
          data: doc.data(),
        }));
        setTickets(ticketData);
      })
      .catch((error) => console.log(error));
  });
  
  return (
    <div className="client_tickets">
      <div className="client_tickets_header">
        <div className="clients_tickets_header_title">
          {tickets?.length === 0 ? (
            <h4>Kindly wait for an agent to be available.Thank you for your patience</h4>
          ) : (
            <h4>Tickets in progress: {tickets.length} </h4>
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
              date={ticket.data.date}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TicketsInProgress;

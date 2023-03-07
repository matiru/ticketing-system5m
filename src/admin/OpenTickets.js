import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../customers/ClientTickets.css";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { db } from "../database/firebase";
import Ticket_infoa3 from "../customers/Tickets_infoa3";
import { useStateValue } from "../Redux/StateProvider";
//import { query, collection, onSnapshot } from "firebase/firestore";

function ClientTickets() {
  const [tickets, setTickets] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  // useEffect(() => {
  //   db.collection("tickets")
  //     .where("customer", "==", user.email)
  //     .where("status", "==", "closed")
    

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
      .where("status", "==", "closed")
      .get()
      .then((querySnapshot) => {
        const tickets = [];
        querySnapshot.forEach((doc) => {
          tickets.push({
            uid: user.uid,
            id: doc.id,
            data: doc.data(),
          });
        });
        tickets.sort((a, b) => {
          return a.data.timestamp.seconds - b.data.timestamp.seconds;
        });
        setTickets(tickets);
      })
      .catch((error) => {
        console.log("Error getting closed tickets: ", error);
      });
  }, []);
  

  tickets.sort((a, b) => {
    return a.data.timestamp.seconds - b.data.timestamp.seconds;
  });

  return (
    <div className="client_tickets">
      <div className="client_tickets_header">
        <div className="clients_tickets_header_title">
          {tickets?.length === 0 ? (
            <h2>You have no closed tickets 😢</h2>
          ) : (
            <h3>My Total Tickets: {tickets.length} </h3>
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
              timestamp={ticket.data.timestamp}
              description={ticket.data.description}
              customer={ticket.data.customer}
              rate={ticket.data.rate}
              date={ticket.data.date}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientTickets;

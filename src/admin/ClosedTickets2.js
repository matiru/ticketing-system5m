import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../customers/ClientTickets.css";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { db } from "../database/firebase";
import Ticket_info from "../customers/Ticket_info";
import { useStateValue } from "../Redux/StateProvider";
//import { query, collection, onSnapshot } from "firebase/firestore";

function ClientTickets() {
  const [tickets, setTickets] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  // useEffect(() => {
  //   db.collection("tickets")
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
      .where("status", "==", "closed")
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
  }, []);
  
  
  
  
  
  
  
  
  
  
  
  
  tickets.sort((a, b) => {
    return a.data.timestamp.seconds - b.data.timestamp.seconds;
  });
  return (
    <div className="client_tickets">
      <div className="client_tickets_header">
        <Link to="/adminagent" className="backheader_link">
          <ArrowCircleLeftOutlinedIcon className="back_button" />
        </Link>
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
            <Ticket_info
              key={ticket.id}
              // open={ticket.data.open}
              id={ticket.id}
              date={ticket.data.date}
              status={ticket.data.status}
              agent={ticket.data.agent}
              description={ticket.data.description}
              subject={ticket.data.subject}
              timestamp={ticket.data.timestamp}
              customer={ticket.data.customer}
              rate={ticket.data.rate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientTickets;

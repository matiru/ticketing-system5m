import "./SuperAgent.css";
import Ticket_infoa1 from "../customers/Ticket_infoa1";
import React, { useEffect, useState } from "react";
import "./SuperAgent.css";
import {  db } from "../database/firebase";
import { useStateValue } from "../Redux/StateProvider";



const TicketsDisplay = () => {

  
  const [{ user }, dispatch] = useStateValue();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    
  
    const openQuery = db.collection("tickets").where("agent", "==", user.email).where("status", "==", "open");
    const inProgressQuery = db.collection("tickets").where("agent", "==", user.email).where("status", "==", "In progress");
    
    Promise.all([openQuery.get(), inProgressQuery.get()])
      .then((querySnapshots) => {
        const ticketData = [];
        querySnapshots.forEach((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            ticketData.push({
              uid: user.uid,
              id: doc.id,
              data: doc.data(),
            });
          });
        });
        setTickets(ticketData);
      })
      .catch((error) => {
        console.log("Error getting tickets: ", error);
      });
  });

    return(
        <>
          <div className="agentdashboard_tickets_ticketsdisplay">
          {tickets.map((ticket) => (
            <Ticket_infoa1
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

 </>
    )
}
export default TicketsDisplay;
 
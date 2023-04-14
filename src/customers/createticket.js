import React, { useState,useEffect } from "react";
import "./RaiseTicket.css";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../database/firebase";
import { useStateValue } from "../Redux/StateProvider";
import {query, limit, getDocs,getDoc, updateDoc,getCountFromServer , where,doc} from 'firebase/firestore';
import "firebase/compat/firestore";
import { useNavigate } from "react-router-dom";

const CreateTicketcom = () => {

    const [input, setInput] = useState("");  
    const [input1, setInput1] = useState("");
    const [{ user }, dispatch] = useStateValue();
    const [loading, setLoading] = useState(false);






    const cancel = async (e) => {
        e.preventDefault();
        setInput("");
        setInput1("");
      };



    const createTicket = async (subject, description, customerEmail) => {
        try {
          const ticketsRef = collection(db, "tickets");
          const agentsRef = collection(db, "agents");
          const counterRef = collection(db, "counter");
      
          // Find an available agent
          const availableAgents = await getDocs(query(agentsRef, where("isActive", "==", true)));
          if (!availableAgents.empty) {
            const assignedAgent = availableAgents.docs[Math.floor(Math.random() * availableAgents.docs.length)];
      
            // Get the total number of tickets
            const ticketCount = await getCountFromServer(query(ticketsRef));
            const allTicketsCount = ticketCount.data().count;
      
            // Create a new ticket document with the given fields and assign to agent
            const newTicketRef = await addDoc(ticketsRef, {
              id: allTicketsCount + 1,
              subject,
              description,
              time: serverTimestamp(),
              status: "open",
              customer: customerEmail,
              timestamp: serverTimestamp(),
              closing_timestamp: serverTimestamp(),
              date: new Date().toLocaleDateString(),
              assigned: true,
              agent: assignedAgent.data().email
            });
      
            // Update the assigned agent's status
            await updateDoc(assignedAgent.ref, { isActive: false });
      
            window.alert("Ticket successfully created. Our agent will contact you soon! Be sure to check your open tickets for communication with the agent!");
            return newTicketRef.id;
          } else {
            // No active agents found, add a queue number property to the ticket
            const ticketCount = await getCountFromServer(query(ticketsRef));
      
            const newTicketRef = await addDoc(ticketsRef, {
              id: ticketCount.data().count + 1,
              subject,
              description,
              time: serverTimestamp(),
              status: "pending",
              customer: customerEmail,
              timestamp: serverTimestamp(),
              closing_timestamp: serverTimestamp(),
              date: new Date().toLocaleDateString(),
              
            });
      
            window.alert("Sorry, no agents are currently available. Your ticket has been added to the queue.");
            return newTicketRef.id;
          }
        } catch (error) {
          console.error(error);
          // Handle error gracefully
          throw new Error("Failed to create a new ticket.");
        }
      };
    

      // const createTicket = async (subject, description, customerEmail) => {
      //   try {
      //     const ticketsRef = collection(db, "tickets");
      //     const agentsRef = collection(db, "agents");
      //     const counterRef = collection(db, "counter");
      
      //     // Find an available agent whose status is active and whose last assigned is the earliest
      //     const availableAgents = await getDocs(query(agentsRef, where("isActive", "==", true), orderBy("last_assigned", "asc"), limit(1)));
      //     if (!availableAgents.empty) {
      //       const assignedAgent = availableAgents.docs[0];
      
      //       // Get the total number of tickets
      //       const ticketCount = await getCountFromServer(query(ticketsRef));
      //       const allTicketsCount = ticketCount.data().count;
      
      //       // Create a new ticket document with the given fields and assign to agent
      //       const newTicketRef = await addDoc(ticketsRef, {
      //         id: allTicketsCount + 1,
      //         subject,
      //         description,
      //         time: serverTimestamp(),
      //         status: "open",
      //         customer: customerEmail,
      //         timestamp: serverTimestamp(),
      //         closing_timestamp: serverTimestamp(),
      //         date: new Date().toLocaleDateString(),
      //         assigned: true,
      //         agent: assignedAgent.data().email
      //       });
      
      //       // Update the assigned agent's status
      //       await updateDoc(assignedAgent.ref, { isActive: false });
      //       // Update the last assigned agent
      //       await updateDoc(doc(agentsRef, "last_assigned"), { email: assignedAgent.data().email });
      
      //       window.alert("Ticket successfully created. Our agent will contact you soon! Be sure to check your open tickets for communication with the agent!");
      //       return newTicketRef.id;
      //     } else {
      //       // No active agents found, add a queue number property to the ticket
      //       const ticketCount = await getCountFromServer(query(ticketsRef));
      
      //       const newTicketRef = await addDoc(ticketsRef, {
      //         id: ticketCount.data().count + 1,
      //         subject,
      //         description,
      //         time: serverTimestamp(),
      //         status: "pending",
      //         customer: customerEmail,
      //         timestamp: serverTimestamp(),
      //         closing_timestamp: serverTimestamp(),
      //         date: new Date().toLocaleDateString(),
      //         assigned: false,
      //       });
      
      //       window.alert("Sorry, no agents are currently available. Your ticket has been added to the queue.");
      //       return newTicketRef.id;
      //     }
      //   } catch (error) {
      //     console.error(error);
      //     // Handle error gracefully
      //     throw new Error("Failed to create a new ticket.");
      //   }
      // };
      
      const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const newTicketId = await createTicket(input, input1, user.email);
          setInput("");
          setInput1("");
          setLoading(false);
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };
      
    
   













    return(
        <>

<div className="createticket">
          <div className="ticketcontent">
          <div className={loading ? "loading" : " "}>
          <h3>create ticket 😃 </h3>
                </div>
         
           
            <form className="add">
          
              <div className="ticket_subject">
              
                <h5>*subject:</h5>
                <select
                  className="select"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                >
                  <option></option>
                  <option value="SoftWare Problem">SoftWare Problem</option>
                  <option value="Access And Permission Grants">
                    Access And Permission Grants{" "}
                  </option>
                  <option value="Internet Problem">Internet Problem</option>
                  <option value="Hardware Failure">Hardware Failure</option>
                  <option value="Aquistion/Setting Up Of New Equipment">
                    Aquistion/Setting Up Of New Equipment
                  </option>
                  <option value="Staff Induction And Training">
                    Staff Induction And Training
                  </option>
                  <option value="General Consultation">
                    General Consultation
                  </option>
                  <option value="Licences Renewal and Activation">
                    Licences Renewal and Activation
                  </option>
                  <option value="Files Backup">Files Backup</option>
                  <option selected value="Service and Maintenance of Equipment">
                    Service and Maintenance of Equipment
                  </option>
                  <option value="Website Overhaul">Website Overhaul</option>
                </select>
              </div>
             
              <div className="ticket_description">
                <h5>description: </h5>
                <textarea
                  className="textarea"
                  type="text"
                  onChange={(e) => setInput1(e.target.value)}
                  value={input1}
                ></textarea>
              </div>
              
              <div className="wrap_buttons">
                <button
                  type="submit"
                  onClick={submit}
                  className="ticket_submit_button"
                >
                  submit
                </button>

                <button onClick={cancel} className="ticket_cancel_button">
                  cancel
                </button>
              </div>
            </form>
          
          </div>
        </div>

 </>
    )
}
export default CreateTicketcom ;
 
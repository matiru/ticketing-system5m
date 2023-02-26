import React, { useState } from "react";
import "./RaiseTicket.css";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../database/firebase";
import { useStateValue } from "../Redux/StateProvider";
import {query, limit, getDocs, updateDoc,getCountFromServer , where,doc} from 'firebase/firestore';
import "firebase/compat/firestore";
import { useNavigate } from "react-router-dom";



function RaiseTicket({ id }) {
  const [{ user }, dispatch] = useStateValue();
  
const [loading, setLoading] = useState(false);

  
  const navigate = useNavigate();

  const handleAuthenticaton = () => {
    if (user) {
      auth.signOut();
      navigate("/");
    }
  };

  const cancel = async (e) => {
    e.preventDefault();
    setInput("");
    setInput1("");
  };

  // const submit = async (e) => {
    
  //   e.preventDefault();

  //   const getTickets = query(collection(db, "tickets"));
  //   const ticketCount = await getCountFromServer(getTickets);
  //   const allTicketsCount = ticketCount.data().count;

  //   const docRef = await addDoc(collection(db, "tickets"), {
     
  //     id: allTicketsCount + 1,
  //     subject: input,
  //     description: input1,
  //     time : serverTimestamp(),
  //     status: "open",
  //     customer: user.email,
  //     timestamp: serverTimestamp(),
  //     closing_timestamp: serverTimestamp(),
  //     date: new Date().toLocaleDateString(),

  //   });
  //   collection(db, "agents");
    
  //   const query_ = query(collection(db, "agents"), where("isActive", "==", true));
  //   const snapshot = await getCountFromServer(query_);
  //   console.log("count: ", snapshot.data().count);
  //   const agentCount = snapshot.data().count;

  //   collection(db, "counter");
  //   const query1 = query(collection(db, "counter"));
  //   const snapshot1 = await getDocs(query1);
  //   snapshot1.forEach(async (doc) => {
  //     console.log(doc.id, "=>", doc.data());
  //     const nextAgent = doc.data().nextagent;
  //     console.log("next agent: ", nextAgent);

  //     const q = query(collection(db, "agents"), where("isActive", "==", true), limit(nextAgent));
  //     //const querySnapshot = await getDocs(q)is a promise so we need to use await to get the data
  //     const querySnapshot = await getDocs(q);

  //     querySnapshot.forEach((doc) => {
  //       const agentN = doc.data().email;
  //       const data = {
  //         agent: agentN,
  //       };
  //       updateDoc(docRef, data);
  //       console.log("agent email: ", agentN);
  //     });
  //     // update counter if nextAgent is less than or equal to agentCount else set nextAgent to 1 in firebase
  //     // update counter while nextAgent is less than  agent

  //     if (nextAgent < agentCount) {
  //       db.collection("counter")
  //         .doc("counter")
  //         .update({
  //           nextagent: nextAgent + 1,
  //         });
  //     } else {
  //       db.collection("counter").doc("counter").update({
  //         nextagent: 1,
  //       });
  //     }
  //   });

  //   // if (nextAgent <= agentCount) {
  //   //   await updateDoc(query1("counter"), { nextagent: nextAgent + 1 });
  //   // } else {
  //   //   await updateDoc(query1("counter"), { nextagent: 1 });
  //   // }

  //   setInput("");
  //   setInput1("");

  //   window.alert(
  //     "Ticket successfully created our agent will contact you soon ! Be sure to check your open tickets for communication with the the agent!"
  //   );
  //   return nextAgent;
  // };

  // const submit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  
  //   const tickets = collection(db, "tickets");
  //   const agents = collection(db, "agents");
  //   const counter = collection(db, "counter");
  
  //   try {
  //     const ticketCount = await getCountFromServer(query(tickets));
  //     const allTicketsCount = ticketCount.data().count;
  
  //     const docRef = await addDoc(tickets, {
  //       id: allTicketsCount + 1,
  //       subject: input,
  //       description: input1,
  //       time: serverTimestamp(),
  //       status: "open",
  //       customer: user.email,
  //       timestamp: serverTimestamp(),
  //       closing_timestamp: serverTimestamp(),
  //       date: new Date().toLocaleDateString(),
  //       assigned : false,
  //     });
  
  //     const agentQuery = query(agents, where("isActive", "==", true));
  //     const agentSnapshot = await getCountFromServer(agentQuery);
  //     const agentCount = agentSnapshot.data().count;
  
  //     const counterQuery = query(counter);
  //     const counterSnapshot = await getDocs(counterQuery);
  //     const counterDoc = counterSnapshot.docs[0];
  
  //     let nextAgent = counterDoc.data().nextagent;
  
  //     const agentQueryLimit = query(agents, where("isActive", "==", true), limit(nextAgent));
  //     const agentSnapshotLimit = await getDocs(agentQueryLimit);
  
  //     agentSnapshotLimit.forEach((agentDoc) => {
  //       const agentEmail = agentDoc.data().email;
  //       const data = {
  //         agent: agentEmail,
  //       };
  //       updateDoc(docRef, data);
  //     });
  
  //     if (nextAgent < agentCount) {
  //       await updateDoc(counterDoc.ref, { nextagent: nextAgent + 1 });
  //     } else {
  //       await updateDoc(counterDoc.ref, { nextagent: 1 });
  //     }
  
  //     setInput("");
  //     setInput1("");
  
  //     window.alert(
  //       "Ticket successfully created our agent will contact you soon ! Be sure to check your open tickets for communication with the the agent!"
  //     );
  //     setLoading(false)
  
  //     return nextAgent;
  //   } catch (error) {
  //     console.error(error);
  //     // Handle error gracefully
  //     setLoading(false)
  //   }
  // };
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const tickets = collection(db, "tickets");
    const agents = collection(db, "agents");
    const counter = collection(db, "counter");
  
    try {
      // Set all agents to active when the program is started

  
      const ticketCount = await getCountFromServer(query(tickets));
      const allTicketsCount = ticketCount.data().count;
  
      const docRef = await addDoc(tickets, {
        id: allTicketsCount + 1,
        subject: input,
        description: input1,
        time: serverTimestamp(),
        status: "open",
        customer: user.email,
        timestamp: serverTimestamp(),
        closing_timestamp: serverTimestamp(),
        date: new Date().toLocaleDateString(),
        assigned: false,
      });
  
      const agentQuery = query(agents, where("isActive", "==", true));
      const agentSnapshot = await getDocs(agentQuery);
      const agentsArr = agentSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const agentCount = agentsArr.length;
  
      if (agentCount > 0) {
        const randomIndex = Math.floor(Math.random() * agentCount);
        const assignedAgent = agentsArr[randomIndex];
  
        const data = {
          agent: assignedAgent.email,
          assigned :true,
        };
        updateDoc(docRef, data);
  
        // Update the assigned agent's status to inactive
        await updateDoc(doc(agents, assignedAgent.id), { isActive: false });
  
        window.alert(
          "Ticket successfully created. Our agent will contact you soon! Be sure to check your open tickets for communication with the agent!"
        );
      } else {
        // No active agents found, add a queue number property to the ticket
        const queueNumber = allTicketsCount + 1;
        const data = {
          queueNumber: queueNumber,
        };
        updateDoc(docRef, data);
  
        window.alert(
          "Sorry, no agents are currently available. Your ticket has been added to the queue."
        );
      }
  
      setInput("");
      setInput1("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      // Handle error gracefully
      setLoading(false);
    }
  };
  

  const [input, setInput] = useState("");

  const [input1, setInput1] = useState("");

  return (
    <div className="raiseticket">
      <div className="raiseticket_header">
        <h1>Hello welcome {user.email}</h1>

        <span onClick={handleAuthenticaton} className="linkagent1">
          {user ? "Sign Out" : "Sign In"}
        </span>
      </div>
      <div className=" raiseticket_footer">
        <div className="sidebar">
          <div className="button_container">
            <Link to="profile" className="header_link">
              <span className="span_tickets">
                <h2>My Profile</h2>
              </span>
            </Link>
          </div>
          <div className="button_container">
            <Link to="mytickets" className="header_link">
              <span className="span_mytickets">
                <h2>My Open Tickets</h2>
              </span>
            </Link>
          </div>
          <div className="button_container">
            <Link to="myprogressedtickets" className="header_link">
              <span className="span_mytickets">
                <h2>Tickets In Progess</h2>
              </span>
            </Link>
          </div>
          <div className="button_container">
            <Link to="opentickets" className="header_link">
              <span className="span_mytickets">
                <h2>My Closed Tickets</h2>
              </span>
            </Link>
          </div>
        </div>

        <div className="createticket">
          <div className="ticketcontent">
          <div className={loading ? "loading" : " "}>
          <h3>create ticket 😃 </h3>
                </div>
         
           
            <form className="add">
          
              <div className="ticket_subject">
              
                <h5>subject: </h5>
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
                {/* <input
                  value={input}
                  // onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message"
                  type="text"
                  maxLength="70"
                /> */}
              </div>
             
              <div className="ticket_description">
                <h5>description: </h5>
                <textarea
                  className="ticket_description"
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
      </div>
    </div>
  );
}

export default RaiseTicket;

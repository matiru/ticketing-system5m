import React, { useState } from "react";
import "./RaiseTicket.css";
import { Link } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../database/firebase";
import { useStateValue } from "../Redux/StateProvider";
import {query, limit, getDocs, updateDoc,getCountFromServer , where} from 'firebase/firestore';
import "firebase/compat/firestore";
import { useNavigate } from "react-router-dom";

function RaiseTicket({ id }) {
  const [{ user }, dispatch] = useStateValue();

  
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

  const submit = async (e) => {
    
    e.preventDefault();

    const getTickets = query(collection(db, "tickets"));
    const ticketCount = await getCountFromServer(getTickets);
    const allTicketsCount = ticketCount.data().count;

    const docRef = await addDoc(collection(db, "tickets"), {
     
      id: allTicketsCount + 1,
      subject: input,
      description: input1,
      time : serverTimestamp(),
      status: "open",
      customer: user.email,
      timestamp: serverTimestamp(),
      closing_timestamp: "",
      date: new Date().toLocaleDateString(),

    });
    collection(db, "agents");
    
    const query_ = query(collection(db, "agents"), where("isActive", "==", true));
    const snapshot = await getCountFromServer(query_);
    console.log("count: ", snapshot.data().count);
    const agentCount = snapshot.data().count;

    collection(db, "counter");
    const query1 = query(collection(db, "counter"));
    const snapshot1 = await getDocs(query1);
    snapshot1.forEach(async (doc) => {
      console.log(doc.id, "=>", doc.data());
      const nextAgent = doc.data().nextagent;
      console.log("next agent: ", nextAgent);

      const q = query(collection(db, "agents"), where("isActive", "==", true), limit(nextAgent));
      //const querySnapshot = await getDocs(q)is a promise so we need to use await to get the data
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const agentN = doc.data().email;
        const data = {
          agent: agentN,
        };
        updateDoc(docRef, data);
        console.log("agent email: ", agentN);
      });
      // update counter if nextAgent is less than or equal to agentCount else set nextAgent to 1 in firebase
      // update counter while nextAgent is less than  agent

      if (nextAgent < agentCount) {
        db.collection("counter")
          .doc("counter")
          .update({
            nextagent: nextAgent + 1,
          });
      } else {
        db.collection("counter").doc("counter").update({
          nextagent: 1,
        });
      }
    });

    // if (nextAgent <= agentCount) {
    //   await updateDoc(query1("counter"), { nextagent: nextAgent + 1 });
    // } else {
    //   await updateDoc(query1("counter"), { nextagent: 1 });
    // }

    setInput("");
    setInput1("");

    window.alert(
      "Ticket successfully created our agent will contact you soon ! Be sure to check your open tickets for communication with the the agent!"
    );
    return nextAgent;
  };

  // assign nextAgent return value  to a variable
  const nextAgent = submit();
  console.log("next agent: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" ,nextAgent);

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
            <h3>create ticket 😃 </h3>

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

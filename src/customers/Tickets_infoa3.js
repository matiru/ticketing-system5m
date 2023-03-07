import React, { useState, useEffect } from "react";
import "./Ticket_info.css";
import firebase from "firebase/compat/app";
import { useStateValue } from "../Redux/StateProvider";
import { db } from "../database/firebase";
import { Modal } from "@mui/material";
import { serverTimestamp } from "firebase/firestore";
import"./Chat.css";


function Ticket_infoa3({ subject, agent, status, id, description, rate,customer,date}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [input1, setInput1] = useState("");

  const [seed, setSeed] = useState("");

  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  // useEffect(() => {
  //   db.collection("tickets")
  //     .doc(id)
  //     .collection("messages")
  //     .orderBy("timestamp", "asc")
  //     .onSnapshot((snapshot) =>
  //       setMessages(snapshot.docs.map((doc) => doc.data()))
  //     );
  // }, []);




  useEffect(() => {
    db.collection("tickets")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .get()
      .then((snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      });
  });
  



    const rateTicket = (e) => {
      e.preventDefault();

      db.collection("tickets")
        .doc(id)
        .update({
          rate: input1,
        })
        .then(function () {
          console.log("status updated");
        });
    };
  
  
        
  

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("tickets").doc(id).collection("messages").add({
      message: input,
      name: user.displayName,
      email: user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      
    });

    setInput("");
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <div classname="ticketholder" onClick={() => setOpen(true)}>
      {status === "In progress"  ? (
        <div className="ticket_info">
          <Modal
            className="signup-modal"
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div className="ticketcontent">
              <form className="add">
                <button onClick={handleClose} className="ticket_cancel_modal">
                  X
                </button>

                <div className="ticket_subject">
                  <h5>subject: </h5>
                  <input value={subject} type="text" maxLength="70" />
                </div>

                <div className="ticket_description">
                  <h5>description: </h5>
                  <textarea
                    className="ticket_description"
                    type="text"
                    value={description}
                  ></textarea>
                </div>
                <div className="ticket_subject">
                  <h5>agent-email : </h5>
                  {agent}
                </div>
             
                <div className="chat_body">
                  {messages.map((message) => (
                    <p
                      className={`chat_message ${
                        message.name == user.displayName && "chat_receiver"
                      }`}
                    >
                      <span className="chat_name"> {message.name}</span>
                      {message.message}
                      <span className="chat_timestamp">
                        {new Date(message.timestamp?.toDate()).toUTCString()}
                      </span>
                    </p>
                  ))}
                </div>
                <div className="chat_footer">
                  {/* <InsertEmoticonIcon /> */}
                  <form>
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message"
                      type="text"
                    />
                    <button onClick={sendMessage} type="submit ">
                      Send a message
                    </button>
                  </form>
                  {/* <MicIcon /> */}
                </div>
              </form>
            </div>
          </Modal>
                 <table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Subject</th>
      <th>Status</th>
      <th>Agent</th>
      <th>customer</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{date}</td>
      <td>{subject}</td>
      <td>{status}</td>
      <td>{agent}</td>
      <td>{customer}</td>
    </tr>
  </tbody>
</table>
        </div>
      ) : (
        <div className="ticket_info_closed">
         
         <table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Subject</th>
      <th>Status</th>
      <th>Agent</th>
      <th>Rate Service</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{date}</td>
      <td>{subject}</td>
      <td>{status}</td>
      <td>{agent}</td>
    
      <td> <select
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                  >
                    <option></option>
                    <option value="satisfied">satisfied🙂</option>
                    <option value="moderately_satisfied">
                      moderately-satisfied 🙁
                    </option>
                    <option value="poor">disatisfied 😠</option>
                  </select> </td>
    
    </tr>
  </tbody>
</table>
 <div className="ticket_subject">
                  <button onClick={rateTicket} className="">
                    Rate
                  </button>
                </div>
          {/* <button onClick={closeTicket}>Ticket Closed</button> */}
        </div>
      )}
    </div>
  );
}

export default Ticket_infoa3;

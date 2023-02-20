import React, { useState, useEffect } from "react";
import "./ClientTickets.css";
import "./RaiseTicket.css";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import "./Chat.css";
import firebase from "firebase/compat/app";
import { useStateValue } from "../Redux/StateProvider";
import { useParams } from "react-router-dom";
import "./ClientTickets.css";
import { db } from "../database/firebase";
import { Modal } from "@mui/material";
import { serverTimestamp } from "firebase/firestore";
function Ticket_info({ subject, agent, status, id, description, rate }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [input1, setInput1] = useState("");

  const [seed, setSeed] = useState("");

  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    db.collection("tickets")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map((doc) => doc.data()))
      );
  }, []);
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

  const closeTicket = (e) => {
    e.preventDefault();

    db.collection("tickets")
      .doc(id)
      .update({
        status: "closed",
        closing_timestamp: serverTimestamp(),
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
                {/* <div className="ticket_subject">
                  <h5>rate your service : </h5>
                  <select
                    value={input1}
                    onChange={(e) => setInput1(e.target.value)}
                  >
                    <option></option>
                    <option value="satisfied">satisfied🙂</option>
                    <option value="moderately_satisfied">
                      moderately-satisfied 🙁
                    </option>
                    <option value="poor">disatisfied 😠</option>
                  </select>
                  <button onClick={rateTicket} className="">
                    Rate
                  </button>
                </div> */}
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
          <h3>subject:{subject}</h3>
          <h3>status:{status}</h3>
          <h3>agent:{agent}</h3>

          <button onClick={closeTicket}>closeticket</button>
        </div>
      ) : (
        <div className="ticket_info_closed">
          <Modal
            className="signup-modal"
            open={open}
            onClose={handleClose}
            h
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
                  <input value={subject} type="text" maxLength="70" readOnly />
                </div>

                <div className="ticket_description">
                  <h5>description: </h5>
                  <textarea
                    className="ticket_description"
                    type="text"
                    value={description}
                    readOnly
                  ></textarea>
                </div>
                <div className="ticket_subject">
                  <h5>agent-email : </h5>
                  {agent}
                </div>
                <div className="chat_body">
                  {messages.map((message) => (
                    <p
                      // if the message is from the user then the message will be on the right side
                      // and if the message is from a different user then the message will be on the left side in a different color
                      className={`chat_message ${
                        message.name == user.displayName && "chat_receiver"
                      }`}
                    >
                      <span className="chat_name">{message.name}</span>
                      {message.message}
                      <span className="chat_timestamp">
                        {new Date(message.timestamp?.toDate()).toUTCString()}
                      </span>
                    </p>
                  ))}
                </div>
              </form>
            </div>
          </Modal>
          <h3>subject:{subject}</h3>
          <h3>status:{status}</h3>
          <h3>agent:{agent}</h3>
          <h3>rate:{rate}</h3>

          {/* <button onClick={closeTicket}>Ticket Closed</button> */}
        </div>
      )}
    </div>
  );
}

export default Ticket_info;

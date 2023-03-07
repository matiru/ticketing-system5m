import React, { useState, useEffect } from "react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import firebase from "firebase/compat/app";
import { useStateValue } from "../Redux/StateProvider";
import { db } from "../database/firebase";
import { useParams } from "react-router-dom";
import { Modal } from "@mui/material";
import { serverTimestamp } from "firebase/firestore";

function Ticket_infoa({ subject, customer,agent, status, description, id, rate,date }) {
  const [input, setInput] = useState("");
  const [seed, setSeed] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    db.collection("tickets")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map((doc) => doc.data()))
      );
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("tickets").doc(id).collection("messages").add({
      message: input,
      name: user.displayName,
      email: user.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("")

  };

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <div onClick={() => setOpen(true)}>
      {status === "open" ? (
        <div className="ticket_infoa">
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
                  <h5>client-email : </h5>
                  {customer}
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
          <table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Subject</th>
      <th>Status</th>
      <th>Agent</th>
      <th>customer</th>
      <th>Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{date}</td>
      <td>{subject}</td>
      <td>{status}</td>
      <td>{agent}</td>
      <td>{customer}</td>
      <td>{rate}</td>
    </tr>
  </tbody>
</table>
        </div>
      )}
    </div>
  );
}

export default Ticket_infoa;

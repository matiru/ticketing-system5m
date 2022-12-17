import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../customers/ClientTickets.css";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { useStateValue } from "../Redux/StateProvider";
import "./Report.css";
import { db } from "../database/firebase";
import Report_Info from "./Report_Info";
import "../customers/RaiseTicket.css";
import { query, collection, getDocs, where } from "firebase/firestore";

function AllAgentReport() {
  const [{ user }, dispatch] = useStateValue();
  const [input, setInput] = useState("");

  //fetch all agents emails and corresponding tickets from db and store in array  of objects
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    db.collection("agents").onSnapshot((snapshot) => {
      console.log(snapshot.docs.map((doc) => doc.data().email));
      setAgents(
        snapshot.docs.map((doc) => ({
          uid: user.uid,
          id: doc.id,
          data: doc.data(),
          email: doc.data().email,
        }))
      );

      // get email from selected setAgents and get count of open,closed and total tickets for each agent
      agents.map((agent) => {
        console.log(agent.email);

        db.collection("tickets")
          .where("email", "==", agent.email)
          .onSnapshot((snapshot) => {
            console.log(snapshot.docs.map((doc) => doc.data().email));
            setAgents(
              snapshot.docs.map((doc) => ({
                uid: user.uid,
                id: doc.id,
                data: doc.data(),
                email: doc.data().email,
              }))
            );
          });
      });
    });
  }, []);

  const [openTickets, setOpenTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [satisfied, setSatisfied] = useState(0);
  const [unsatisfied, setUnsatisfied] = useState(0);
  const [modsatisfied, setModsatisfied] = useState(0);
  const [modalRating] = useState("");

  // compare the count of satisfied,unsatisfied and modsatisfied tickets  return the highest value emoji as modal rating
  useEffect(() => {
    if (satisfied > unsatisfied && satisfied > modsatisfied) {
      modalRating(" satisfied😀");
    } else if (unsatisfied > satisfied && unsatisfied > modsatisfied) {
      modalRating("unsatisfied😞");
    } else if (modsatisfied > satisfied && modsatisfied > unsatisfied) {
      modalRating("moderately_satisfied😐");
    }
  }, []);
  useEffect(() => {
    const q = query(
      collection(db, "tickets"),
      where("agent", "==", input),
      where("status", "==", "open")
    );
    getDocs(q).then((querySnapshot) => {
      setOpenTickets(querySnapshot.size);
    });

    const q1 = query(
      collection(db, "tickets"),
      where("agent", "==", input),
      where("status", "==", "closed")
    );
    getDocs(q1).then((querySnapshot) => {
      setClosedTickets(querySnapshot.size);
    });
    const q2 = query(collection(db, "tickets"), where("agent", "==", input));
    getDocs(q2).then((querySnapshot) => {
      setTotalTickets(querySnapshot.size);
    });
  }, [input]);

  useEffect(() => {
    const q = query(
      collection(db, "tickets"),
      where("agent", "==", input),
      where("rate", "==", "satisfied")
    );
    getDocs(q).then((querySnapshot) => {
      setSatisfied(querySnapshot.size);
    });

    const q1 = query(
      collection(db, "tickets"),
      where("agent", "==", input),
      where("rate", "==", "poor")
    );
    getDocs(q1).then((querySnapshot) => {
      setUnsatisfied(querySnapshot.size);
    });
    const q2 = query(
      collection(db, "tickets"),
      where("agent", "==", input),
      where("rate", "==", "modsatisfied")
    );
    getDocs(q2).then((querySnapshot) => {
      setModsatisfied(querySnapshot.size);
    });
  }, [input]);

  return (
    <div className="client_tickets">
      <div className="client_tickets_header">
        <Link to="/adminagent" className="backheader_link">
          <ArrowCircleLeftOutlinedIcon className="back_button" />
        </Link>

        <div className="clients_tickets_display">
          <select
            className="select"
            value={input}
            placeholder="Select Agent"
            onChange={(e) => setInput(e.target.value)}
          >
            {agents.map((agent) => (
              <option value={agent.email}>{agent.email}</option>
            ))}
          </select>
          <div className="ticket_report">
            <div className="total_tickets">
              <span className="total_ticket_span">
                <h2>Total Tickets</h2>
              </span>
              <span className="total_ticket_span1">
                <h1> {totalTickets}</h1>
              </span>
            </div>

            <div className="open_tickets">
              <span className="total_ticket_span">
                <h2>Open Tickets</h2>
              </span>
              <span className="total_ticket_span1">
                <h1> {openTickets}</h1>
              </span>
            </div>

            <div className="closed_tickets">
              <span className="total_ticket_span">
                <h2>Closed Tickets</h2>
              </span>
              <span className="total_ticket_span1">
                <h1> {closedTickets}</h1>
              </span>
            </div>
          </div>
          <div className="rating_report">
            <span className="tickets_ratings">
              <span className="total_ticket_span1">
                <h2>Ratings</h2>
              </span>
            </span>

            <span className="total_ratings">
              <span className="total_ticket_span">
                <h2>modal rating 🧮 </h2>
              </span>
              <span className="total_ticket_span1">
                <h1> {modalRating}</h1>
              </span>
            </span>

            <span className="good_rating">
              <span className="total_ticket_span">
                <h2>Satisfied 🙂 </h2>
              </span>
              <span className="total_ticket_span1">
                <h1>{satisfied}</h1>
              </span>
            </span>

            <span className="average_rating">
              <span className="total_ticket_span">
                <h2>Moderatly Satisfied 🙁 </h2>
              </span>
              <span className="total_ticket_span1">
                <h1> {modsatisfied}</h1>
              </span>
            </span>
            <span className="poor_rating">
              <span className="total_ticket_span">
                <h2>Disatisfied 😠 </h2>
              </span>
              <span className="total_ticket_span1">
                <h1> {unsatisfied}</h1>
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllAgentReport;

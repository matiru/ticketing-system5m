import React, { useEffect, useState } from "react";
import "./Report.css";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { query, collection, getDocs, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "../database/firebase";
import { useStateValue } from "../Redux/StateProvider";
import Report_Info from "./Report_Info";

function Report() {
  // get ticket count for each agent

  const [{ user }, dispatch] = useStateValue();

  // get count of open tickets where agent = user.email
  const [openTickets, setOpenTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [satisfied, setSatisfied] = useState(0);
  const [unsatisfied, setUnsatisfied] = useState(0);
  const [modsatisfied, setModsatisfied] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, "tickets"),
      where("agent", "==", user.email),
      where("status", "==", "open")
    );
    getDocs(q).then((querySnapshot) => {
      setOpenTickets(querySnapshot.size);
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "tickets"),
      where("agent", "==", user.email),
      where("status", "==", "closed")
    );
    getDocs(q).then((querySnapshot) => {
      setClosedTickets(querySnapshot.size);
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "tickets"),
      where("agent", "==", user.email)
    );
    getDocs(q).then((querySnapshot) => {
      setTotalTickets(querySnapshot.size);
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "tickets"),
      where("agent", "==", user.email),
      where("rate", "==", "satisfied")
    );
    getDocs(q).then((querySnapshot) => {
      setSatisfied(querySnapshot.size);
    });
  }, []);
  useEffect(() => {
    const q = query(
      collection(db, "tickets"),
      where("agent", "==", user.email),
      where("rate", "==", "poor")
    );
    getDocs(q).then((querySnapshot) => {
      setUnsatisfied(querySnapshot.size);
    });
  }, []);
  useEffect(() => {
    const q = query(
      collection(db, "tickets"),
      where("agent", "==", user.email),
      where("rate", "==", "modsatisfied")
    );
    getDocs(q).then((querySnapshot) => {
      setModsatisfied(querySnapshot.size);
    });
  }, []);

  return (
    <div className="report">
      <div className="report_header">
        <Link to="/agentdashboard" className="backheader_link">
          <ArrowCircleLeftOutlinedIcon className="back_button1" />
        </Link>
        <span className="total_header_span1">
          <h1> REPORT PAGE</h1>
        </span>
      </div>

      <div className="ticket_report">
        <div className="open_tickets">
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
       

            <h2>Ratings</h2>
          
       

        <div className="open_tickets">
          <span className="total_ticket_span">
            <h2>modal rating 🧮 </h2>
          </span>
          <span className="total_ticket_span1">
            <h1> {} </h1>
          </span>
        </div>

        <div className="open_tickets">
        <span className="total_ticket_span">
            <h2>Satisfied 🙂 </h2>
          </span>
          <span className="total_ticket_span1">
            <h1> {satisfied}</h1>
          </span>
        </div>

        <div className="open_tickets">
          <span className="total_ticket_span">
            <h2>Moderatly Satisfied 🙁 </h2>
          </span>
          <span className="total_ticket_span1">
            <h1> {modsatisfied}</h1>
          </span>
          </div>
        <div className="open_tickets">
          <span className="total_ticket_span">
            <h2>Disatisfied 😠 </h2>
          </span>
          <span className="total_ticket_span1">
            <h1> {unsatisfied}</h1>
          </span>
      </div>
      </div>
    </div>
  );
}

export default Report;

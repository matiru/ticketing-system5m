import React, { useState } from "react";

import "../customers/ClientTickets.css";
import "../customers/RaiseTicket.css";

function Report_Info({ agent, openTickets, closedTickets, totalTickets }) {
  const [input, setInput] = useState("");

  return (
    <select>
      <option></option>
      <option value="agent">{agent}</option>
    </select>
  );
}

export default Report_Info;

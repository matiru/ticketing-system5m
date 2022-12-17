import "./App.css";
import RaiseTicket from "../src/customers/RaiseTicket";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ClientTickets from "../src/customers/ClientTickets";
import OpenTickets from "../src/admin/OpenTickets";
import Profile from "../src/admin/Profile";
import Profile2 from "../src/admin/Profile2";
import Profile1 from "../src/customers/Profile1";
import ClosedTickets from "../src/admin/ClosedTickets";
import ClosedTickets2 from "../src/admin/ClosedTickets2";

import AllAgentReport from "../src/admin/AllAgentReport";
import Report from "../src/admin/Report";
import AdminAgent from "../src/admin/AdminAgent";
import AgentLogin from "./AgentLogin";
import db, { auth } from "../src/database/firebase";
import SignUp from "./SignUp";
import SuperAgent from "../src/admin/SuperAgent";
import AddAgent from "../src/admin/AddAgent";
import { useStateValue } from "../src/Redux/StateProvider";
import LandingPage from "./LandingPage";
import AdminLogin from "./AdminLogin";

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: "SET_USER",
          uid: authUser.uid,
          user: authUser,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/customer" element={<RaiseTicket />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/custo" element={<SignUp />}></Route>
          <Route path="/agentdashboard" element={<SuperAgent />}></Route>
          <Route path="/" element={<LandingPage />}></Route>
          <Route path="/adminagent" element={<AdminAgent />}></Route>
          <Route
            path="/adminagent/closedtickets"
            element={<ClosedTickets2 />}
          ></Route>
          <Route path="/adminagent/agents" element={<AddAgent />}></Route>
          <Route
            path="/adminagent/agentsreport"
            element={<AllAgentReport />}
          ></Route>
          <Route path="adminagent/profile" element={<Profile2 />}></Route>

          <Route path="/agent" element={<AgentLogin />}></Route>
          <Route path="/admin" element={<AdminLogin />}></Route>
          <Route path="/agentdashboard/agents" element={<AddAgent />}></Route>
          <Route path="/customer/mytickets" element={<ClientTickets />}></Route>
          <Route path="/customer/opentickets" element={<OpenTickets />}></Route>
          <Route
            path="/agentdashboard/closedtickets"
            element={<ClosedTickets />}
          ></Route>
          <Route path="/agentdashboard/profile" element={<Profile />}></Route>
          <Route path="/agentdashboard/report" element={<Report />}></Route>
          <Route
            path="/agentdashboard/agentsreport"
            element={<AllAgentReport />}
          ></Route>
          <Route path="/customer/profile" element={<Profile1 />}></Route>
          <Route
            path="/super/closedtickets"
            element={<ClosedTickets />}
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

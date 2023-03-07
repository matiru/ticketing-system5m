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
import AgentProgressed from "../src/admin/AgentProgressed";
import ClosedTickets2 from "../src/admin/ClosedTickets2";
import AllAgentReport from "../src/admin/AllAgentReport";
import Report from "../src/admin/Report";
import AdminAgent from "../src/admin/AdminAgent";
import AgentLogin from "../src/login_and_signup/AgentLogin";
import db, { auth } from "../src/database/firebase";
import SignUp from "./SignUp";
import SuperAgent from "../src/admin/SuperAgent";
import AddAgent from "../src/admin/AddAgent";
import { useStateValue } from "../src/Redux/StateProvider";
import  LandingPage from "../src/login_and_signup/LandingPage";
import AdminLogin from "../src/login_and_signup/AdminLogin";
import TicketsInProgress from "../src/customers/TicketsInProgress";
import AdminProgressedTickets from "../src/admin/Adminpro";
import "./admin/Profile.css";
import Test from "./Test";
import CreateTicketcom from "./customers/createticket";

import ClientsOpenTickets from "./admin/allopentickets";
import TicketsDisplay from "./admin/ticketdisplay";
import { Pending } from "@mui/icons-material";
import PendingTickets from "./customers/pending";
import APendingTickets from "./admin/adminPending";

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
          
        <Route path="/test" element={ <Test/>}></Route>

        <Route path="/customer" element={<RaiseTicket />}>
        <Route path='createticket' element={<CreateTicketcom/>}/>
        <Route path='profile' element={<Profile1 />}/>
        <Route path='pendingtickets' element={<PendingTickets/>}/>
        <Route path='opentickets' element={<ClientTickets/>}/>
        <Route path='progressedtickets' element={<TicketsInProgress/>}/>
        <Route path='closedtickets' element={<OpenTickets/>}/>
        </Route>





          <Route path="/" element={<LandingPage/>}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/agent" element={<AgentLogin />}></Route>
          <Route path="/admin" element={<AdminLogin />}></Route>




          
          <Route path="/adminagent" element={<AdminAgent />}>
          <Route path="profile" element={<Profile2 />}/>
          <Route path="report"  element={<AllAgentReport />}/>
          <Route path='pendingtickets' element={<APendingTickets/>}/>
          <Route path="opentickets" element={< ClientsOpenTickets />}/>
          <Route path="closedtickets" element={<ClosedTickets2 />}/>
          <Route path="ticketsprogressed" element={<AdminProgressedTickets />}/>
          <Route path="addagents" element={<AddAgent />}/>

          </Route>
     





          <Route path="/agentdashboard" element={<SuperAgent />}>

          <Route path="profile" element={<Profile />}/>
          <Route path="report"  element={<Report />}/>
          <Route path="opentickets" element={<TicketsDisplay />}/>
          <Route path="closedtickets" element={<ClosedTickets />}/>
        
            
          </Route>
       \





        </Routes>
      </Router>
    </div>
  );
}

export default App;

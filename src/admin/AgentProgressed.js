import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AllAgentReports.css";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import { useStateValue } from "../Redux/StateProvider";
import { db } from "../database/firebase";
import { query, collection, getDocs, where ,updateDoc,getCountFromServer,limit, orderBy} from "firebase/firestore";
import { Button } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function AllAgentReport() {
  const [{ user }, dispatch] = useStateValue();
  const [input, setInput] = useState("");

  //fetch all agents emails and corresponding tickets from db and store in array  of objects
  const [agents, setAgents] = useState([]);

  const [tickets1, setTickets1] = useState([]);

  const [tickets , SetTickets] = useState([]);




  useEffect(() => {
    const fetchData = async () => {
      const ticketData = await db.collection("tickets").get();
      setTickets1(ticketData.docs.map(doc => doc.data()));
    };
    fetchData();
  });

  const categories = ['open', 'In progress', 'closed'];

  const countTicketsByCategory = () => {
    const ticketCounts = { 'open': 0, 'In progress': 0, 'closed': 0 };
    tickets1.forEach(ticket => {
      ticketCounts[ticket.status] += 1;
    });
    return categories.map(category => ({ category, count: ticketCounts[category] }));
  };

  const data1 = countTicketsByCategory();






  useEffect  (() => {

  db.collection("tickets").where("status" , "==" , "closed" ) 
  .onSnapshot((snapshot) => {
    
      const tickets = snapshot.docs.map((doc) => {
        const timestamp = doc.data().solving_start_time;
        const closing_timestamp = doc.data().closing_timestamp;
        const date_closed = new Date(closing_timestamp.seconds * 1000);
        const date_opened = new Date(timestamp.seconds * 1000);
        const formattedDate = date_opened.toLocaleDateString();
        const formattedTime = date_opened.toLocaleTimeString();
        const formattedTime_close = date_closed.toLocaleTimeString();
        const timeTaken = (date_closed.getTime() - date_opened.getTime()) / 1000;

        function formatTimeTaken(timeTaken) {
          const hours = Math.floor(timeTaken / 3600);
          const minutes = Math.floor((timeTaken % 3600) / 60);
          const seconds = timeTaken % 60;
          return `${hours}h ${minutes}m ${seconds}s`;
        }
       
       // sort tickets by date
      
     
      return {
        id: doc.id,
        data: doc.data(),
        date: formattedDate,
        status: doc.data().status,
        timeOpen:  formattedTime,
        subject: doc.data().subject,
        state: doc.data().state,
        timeClosed: formattedTime_close,
        timeTaken:formatTimeTaken(timeTaken),
        agent: doc.data().agent,
      };
    });
    SetTickets(tickets);
  });
  
},[])
 
//  sort tickets by date
 tickets.sort((a, b) => {
  return a.date - b.date;
});

 tickets.sort((a, b) => {
  return a.data.timestamp.seconds - b.data.timestamp.seconds;
});


useEffect(() => {
  db.collection("agents").onSnapshot((snapshot) => {
    console.log(snapshot.docs.map((doc) => doc.data().email));
    setAgents(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
        email: doc.data().email,
      }))
    );

    // get email from selected setAgents and get count of open,closed and total tickets for each agent
    agents.forEach((agent) => {
      console.log(agent.email);

      db.collection("tickets")
        .where("email", "==", agent.email)
        .onSnapshot((snapshot) => {
          console.log(snapshot.docs.map((doc) => doc.data().email));
          setAgents((prevAgents) =>
            prevAgents.map((prevAgent) =>
              prevAgent.email === agent.email
                ? {
                    uid: user.uid,
                    id: prevAgent.id,
                    data: prevAgent.data,
                    email: prevAgent.email,
                    tickets: snapshot.docs.map((doc) => doc.data()),
                  }
                : prevAgent
            )
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
  const[agentState , setAgentState] = useState("");

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
  useEffect (() => {

    db.collection("agents").where("email","==",input).onSnapshot((snapshot) => {
      // if isActive is true then set agentState to active else set agentState to inactive
      snapshot.docs.map((doc) => {
        if(doc.data().isActive){
          setAgentState("Active");
        }else{
          setAgentState("Inactive");
        }
      })

    })

  },[input])

const handleAgentStatus = (e) => {
  e.preventDefault();
  if(agentState === "Active"){
    db.collection("agents").where("email","==",input).get().then((snapshot) => {
      snapshot.docs.map((doc) => {
        db.collection("agents").doc(doc.id).update({
          isActive : false
        })
      })
    })
  }else{
    db.collection("agents").where("email","==",input).get().then((snapshot) => {
      snapshot.docs.map((doc) => {
        db.collection("agents").doc(doc.id).update({
          isActive : true
        })
      })
    })
  }
}

// use effect triggered after handleAgentStatus is called and agentState is updated
// reassign open tickets to other agents if agent is inactive

useEffect (() => {
  
  if(agentState === "Inactive"){
    db.collection("tickets").where("agent","==",input).get().then((snapshot) => {
      snapshot.docs.map((doc) => {
        db.collection("tickets").doc(doc.id).update({
          agent : "",
          assigned : false
        })
      })
    })

  }
},[agentState])
 


      

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
    <div className="client_ticketsa">
      <div className="client_tickets_headera">
        <Link to="/adminagent" className="backheader_linka">
          <ArrowCircleLeftOutlinedIcon className="back_buttona" />
        </Link>

        <div className="clients_tickets_displaya">
          <label>select Agent</label>
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
        
          <div className="agent_status">
          <h1>{agentState}</h1>
          <Button onClick={handleAgentStatus}>Change status</Button>
          </div>
<>  </>
<>  </>
<>  </>
          <div className="ticket_reporta">
   
            <div className="open_tickets">
              <span className="total_ticket_spana">
                <h2>Total Tickets</h2>
              </span>
              <span className="total_ticket_span1a">
                <h1> {totalTickets}</h1>
              </span>
            </div>

            <div className="open_tickets">
              <span className="total_ticket_spana">
                <h2>Open Tickets</h2>
              </span>
              <span className="total_ticket_span1a">
                <h1> {openTickets}</h1>
              </span>
            </div>

            <div className="closed_tickets">
              <span className="total_ticket_spana">
                <h2>Closed Tickets</h2>
              </span>
              <span className="total_ticket_span1a">
                <h1> {closedTickets}</h1>
              </span>
            </div>
          </div>
          <div className="rating_reporta">
            <span className="tickets_ratingsa">
              <span className="total_ticket_span1a">
                <h2>Ratings</h2>
              </span>
            </span>

            <span className="total_ratingsa">
              <span className="total_ticket_spana">
                <h2>modal rating 🧮 </h2>
              </span>
              <span className="total_ticket_span1a">
                <h1> {modalRating}</h1>
              </span>
            </span>

            <span className="good_ratinga">
              <span className="total_ticket_spana">
                <h2>Satisfied 🙂 </h2>
              </span>
              <span className="total_ticket_span1a">
                <h1>{satisfied}</h1>
              </span>
            </span>

            <span className="average_ratinga">
              <span className="total_ticket_spana">
                <h2>Moderatly Satisfied 🙁 </h2>
              </span>
              <span className="total_ticket_span1a">
                <h1> {modsatisfied}</h1>
              </span>
            </span>
            <span className="poor_ratinga">
              <span className="total_ticket_spana">
                <h2>Disatisfied 😠 </h2>
              </span>
              <span className="total_ticket_span1a">
                <h1> {unsatisfied}</h1>
              </span>
            </span>
          </div>
        </div>
      </div>
        
      <BarChart width={800} height={400} data={data1} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="category" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="count" fill="#8884d8" />
</BarChart>
      <table>
        count : <h3>{tickets.length}</h3>
        <tr>
          <th>DATE</th>
          <th>SUBJECT</th>
          <th>STATUS</th>
          <th>TIME OPEN</th>
          <th>TIME CLOSED</th>
          <th>TIME TAKEN</th>
          <th>AGENT</th>
          <th>RATING</th>
        </tr>
        {tickets.map((ticket) => (
          <tr>
            <td>{ticket.date}</td>
            <td>{ticket.subject}</td>
            <td>{ticket.status}</td>
            <td>{ticket.timeOpen}</td>
            <td>{ticket.timeClosed}</td> 
            <td>{ticket.timeTaken}</td>
            <td>{ticket.agent}</td>
            {ticket.rate === "satisfied" ? (
              <td>
             
                  <h1>🙂</h1>
              
                  </td>
                  ) : ticket.rate === "poor" ? (
                    <td>
                      
                        <h1>😠</h1>
                        
                        </td>
                        ): ticket.rate === "modsatisfied" ? (
                          <td>

                              <h1>🙁</h1>

                              </td>
                              )
                              : ( <td> ? </td> ) 
                              }

        
          </tr>
        ))}


    

    </table>


    </div>
  );
}

export default AllAgentReport;
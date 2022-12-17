import React from "react";
import "./Profile.css";


function Profile_info({name,telephone,email ,role}) {
 return (
   <div className="profilecard">
     <h2>Profile Card</h2>
     <div className="card_details">
       <span className="card_mdetails">
         <h3>Name: {name} </h3>
       </span>

       <h3>Email: {email}</h3>

       <span className="card_mdetails">
         <h3>Telephone: {telephone}</h3>
       </span>
       <span className="card_mdetails">
         <h3>Role: {role} </h3>
       </span>
     </div>
   </div>
 );
}

export default Profile_info;

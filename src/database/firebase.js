import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
const firebaseConfig = {
  apiKey: "AIzaSyCBAyj8D0rhy6sJiWsYTtAXwlOK-MaQe6w",
  authDomain: "ticketing-system-62d9a.firebaseapp.com",
  projectId: "ticketing-system-62d9a",
  storageBucket: "ticketing-system-62d9a.appspot.com",
  messagingSenderId: "112850878709",
  appId: "1:112850878709:web:4c9f6bad88ab27355885bc",
  measurementId: "G-ZHX8T33KSC",
}
// const firebaseConfig = {

//   apiKey: "AIzaSyDZLPaTC17j-p5Z2K8rgnqMKSKIshgZ4oE",
//   authDomain: "tickets-965b0.firebaseapp.com",
//   projectId: "tickets-965b0",
//   storageBucket: "tickets-965b0.appspot.com",
//   messagingSenderId: "158112886755",
//   appId: "1:158112886755:web:2d5d72f4f5772cc48a7ad6",
//   measurementId: "G-ZRZ1C6PE21"

// // };
// const firebaseConfig = {
//   apiKey: "AIzaSyAiiTNRzRA4oOW1jxvrjD_-00P5jA-JKH8",
//   authDomain: "tickating-191da.firebaseapp.com",
//   projectId: "tickating-191da",
//   storageBucket: "tickating-191da.appspot.com",
//   messagingSenderId: "35974958185",
//   appId: "1:35974958185:web:6c8343caa55332b5a1e6f8",
//   measurementId: "G-3PTN7XT5BR",
// };


const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const provider = new firebase.auth();
const auth = firebase.auth();
export { auth, provider, db };
export default db;

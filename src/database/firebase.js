import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
// const firebaseConfig = {
//   apiKey: "AIzaSyCBAyj8D0rhy6sJiWsYTtAXwlOK-MaQe6w",
//   authDomain: "ticketing-system-62d9a.firebaseapp.com",
//   projectId: "ticketing-system-62d9a",
//   storageBucket: "ticketing-system-62d9a.appspot.com",
//   messagingSenderId: "112850878709",
//   appId: "1:112850878709:web:4c9f6bad88ab27355885bc",
//   measurementId: "G-ZHX8T33KSC",
// }

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUt15ma5dfpoBgSOOov1urJVU0V9Xfnwg",
  authDomain: "ticketing-system5m.firebaseapp.com",
  projectId: "ticketing-system5m",
  storageBucket: "ticketing-system5m.appspot.com",
  messagingSenderId: "1008225375045",
  appId: "1:1008225375045:web:46973f2e610d3ff8f8242c",
  measurementId: "G-JMT73RM273"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const provider = new firebase.auth();
const auth = firebase.auth();
export { auth, provider, db };
export default db;

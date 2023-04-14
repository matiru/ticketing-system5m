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
//   apiKey: "AIzaSyDGjzhMOVD1ZVAx2dDdQMDYvrVKJyaPrYg",
//   authDomain: "ticketing-system5m-caaa5.firebaseapp.com",
//   projectId: "ticketing-system5m-caaa5",
//   storageBucket: "ticketing-system5m-caaa5.appspot.com",
//   messagingSenderId: "661401109698",
//   appId: "1:661401109698:web:8b2c8647d29048c592675b",
//   measurementId: "G-FLGCVXMP06"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyDBMfRIt9hCoWiyJ0Y632CeNIskXjxqjF0",
//   authDomain: "ticketing-system-4b47b.firebaseapp.com",
//   projectId: "ticketing-system-4b47b",
//   storageBucket: "ticketing-system-4b47b.appspot.com",
//   messagingSenderId: "225180538539",
//   appId: "1:225180538539:web:691d15f37774f5ede409ee",
//   measurementId: "G-RK8TBZXHCV"
// };



// const firebaseConfig = {
//   apiKey: "AIzaSyDwIO5DXxvlHuMO_-dU4emNq7RYE9i9-Hs",
//   authDomain: "ticketing--system5m.firebaseapp.com",
//   projectId: "ticketing--system5m",
//   storageBucket: "ticketing--system5m.appspot.com",
//   messagingSenderId: "385924858926",
//   appId: "1:385924858926:web:587beb87b435f23713cbbf",
//   measurementId: "G-D8MMB2PPMS"
// };


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDUt15ma5dfpoBgSOOov1urJVU0V9Xfnwg",
//   authDomain: "ticketing-system5m.firebaseapp.com",
//   projectId: "ticketing-system5m",
//   storageBucket: "ticketing-system5m.appspot.com",
//   messagingSenderId: "1008225375045",
//   appId: "1:1008225375045:web:46973f2e610d3ff8f8242c",
//   measurementId: "G-JMT73RM273"
// };
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const provider = new firebase.auth();
const auth = firebase.auth();
export { auth, provider, db };
export default db;

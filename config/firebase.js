import * as firebase from "firebase";
// Initialize Firebase
 const firebaseConfig = {
  apiKey: "AIzaSyCBvLV_hhdxT0PmNseELnw2VgEz9StJ0Xg",
  authDomain: "husba1.firebaseapp.com",
  databaseURL: "https://husba1.firebaseio.com",
  projectId: "husba1",
  storageBucket: "husba1.appspot.com",
  messagingSenderId: "459100135694",
  appId: "1:459100135694:web:07c341dc4c2a659c3ef75f",
  measurementId: "G-9QR42FLEL3"
};
firebase.initializeApp(firebaseConfig);

//export db from here for using it in all page like im using firestore so for acceccing firestore in all pages we use db ,
export default firebase;

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9jabuI2Xlk5OS7m4Fc2k2FnNCNQXfbWY",
  authDomain: "notesapp-6cab6.firebaseapp.com",
  projectId: "notesapp-6cab6",
  storageBucket: "notesapp-6cab6.appspot.com",
  messagingSenderId: "565035619431",
  appId: "1:565035619431:web:199e6e54d64f59f66470c2",
  measurementId: "G-VVMTM6FMEY",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);

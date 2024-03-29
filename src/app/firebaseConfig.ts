// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNKPB9P962X_-dx68JWGJFb2otLMDkuh0",
  appId: "1:295257244880:web:b084c3cfe237bb3a038ad5",
  authDomain: "mark-map-test-task.firebaseapp.com",
  databaseURL: "https://mark-map-test-task-default-rtdb.europe-west1.firebasedatabase.app",
  measurementId: "G-LJVEMBG7VX",
  messagingSenderId: "295257244880",
  projectId: "mark-map-test-task",
  storageBucket: "mark-map-test-task.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
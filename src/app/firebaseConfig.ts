// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  appId: process.env.APP_ID ,
  authDomain: process.env.AUTH_DOMAIN ,
  databaseURL: process.env.DATABASE_URL ,
  measurementId: process.env.MEASUREMENT_ID ,
  messagingSenderId: process.env.MESSAGING_SENDER_ID ,
  projectId: process.env.PROJECT_ID ,
  storageBucket: process.env.STORAGE_BUCKET
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
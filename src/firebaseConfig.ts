// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PRIVATE_API_KEY as string,
  appId: process.env.NEXT_PRIVATE_APP_ID as string,
  authDomain: process.env.NEXT_PRIVATE_AUTH_DOMAIN as string,
  databaseURL: process.env.NEXT_PRIVATE_DATABASE_URL as string,
  measurementId: process.env.NEXT_PRIVATE_MEASUREMENT_ID as string,
  messagingSenderId: process.env.NEXT_PRIVATE_MESSAGING_SENDER_ID as string,
  projectId: process.env.NEXT_PRIVATE_PROJECT_ID as string,
  storageBucket: process.env.NEXT_PRIVATE_STORAGE_BUCKET as string,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
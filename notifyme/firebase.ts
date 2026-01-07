import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUfMb4eAL-G5nGXzKqWTFzqHo0UW2WkYs",
  authDomain: "kuan-612ce.firebaseapp.com",
  databaseURL: "https://kuan-612ce-default-rtdb.firebaseio.com",
  projectId: "kuan-612ce",
  storageBucket: "kuan-612ce.firebasestorage.app",
  messagingSenderId: "711077528215",
  appId: "1:711077528215:web:5c973c076440fb243a1fd2",
  measurementId: "G-LPNHZQXTJS"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
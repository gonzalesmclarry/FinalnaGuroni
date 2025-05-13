import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { initializeAuth, browserLocalPersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUfMb4eAL-G5nGXzKqWTFzqHo0UW2WkYs",
  authDomain: "kuan-612ce.firebaseapp.com",
  databaseURL: "https://kuan-612ce-default-rtdb.firebaseio.com",
  projectId: "kuan-612ce",
  storageBucket: "kuan-612ce.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "711077528215",
  appId: "1:711077528215:web:5c973c076440fb243a1fd2",
  measurementId: "G-LPNHZQXTJS"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth with browserLocalPersistence
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
});

// Initialize Firebase Analytics (conditionally, if supported)
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});
export { analytics };
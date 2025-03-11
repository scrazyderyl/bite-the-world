// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Import Firebase Authentication

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-lQOZsn6KxK6i2zeSfLGv0OBm4oFfMbc",
  authDomain: "bite-the-world.firebaseapp.com",
  projectId: "bite-the-world",
  storageBucket: "bite-the-world.appspot.com", // FIXED: Corrected storageBucket
  messagingSenderId: "867259646684",
  appId: "1:867259646684:web:6dd06e926125ea3f0d2a19",
  measurementId: "G-0KZ5GEXBX0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth }; // Export auth for use in Signup and Login components

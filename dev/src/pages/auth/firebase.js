// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4y3OjnVjaac6bfttNMGR8gl7yfn6Qsck",
  authDomain: "btne-541be.firebaseapp.com",
  projectId: "btne-541be",
  storageBucket: "btne-541be.firebasestorage.app",
  messagingSenderId: "110707125420",
  appId: "1:110707125420:web:423611207d99cfdd61c309",
  measurementId: "G-FEH30BVJ3L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const AuthDB = getFirestore(app);
export default app;
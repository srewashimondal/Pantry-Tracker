// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore} from 'firebase/firestore';
import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtTY8oji8RTkJSNuvodtclpUZQyiYOBdc",
  authDomain: "pantry-tracker-908ab.firebaseapp.com",
  projectId: "pantry-tracker-908ab",
  storageBucket: "pantry-tracker-908ab.appspot.com",
  messagingSenderId: "1037709108882",
  appId: "1:1037709108882:web:f28add4e1065ce72a7684b",
  measurementId: "G-8J2MV6672S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export {firestore};
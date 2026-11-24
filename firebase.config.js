// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCAj-f227iHPd_tAKD0SgownA95fEzaU2E",
    authDomain: "dhidroid-labs.firebaseapp.com",
    projectId: "dhidroid-labs",
    storageBucket: "dhidroid-labs.firebasestorage.app",
    messagingSenderId: "691191185005",
    appId: "1:691191185005:web:ae1cae23b58d9ea5d1c964",
    measurementId: "G-ELNNP2XDQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
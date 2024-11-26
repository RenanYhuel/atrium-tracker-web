// Import the functions you need from the SDKs you need

import firebase from "firebase/app";
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBXs1vp7FMKQU4jy1PRvyvdeNRg1JJKbr8",
    authDomain: "atrium-tracker-web.firebaseapp.com",
    projectId: "atrium-tracker-web",
    storageBucket: "atrium-tracker-web.firebasestorage.app",
    messagingSenderId: "419373553436",
    appId: "1:419373553436:web:ce5c29092be00a404a8cd9",
    measurementId: "G-MHHE1ZBNM6"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export const firestore = firebase.firestore();
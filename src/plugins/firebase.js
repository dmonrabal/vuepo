// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth/';

const firebaseConfig = {
  apiKey: 'AIzaSyBiALExdpMlFtJv_2vO1V-1oH0B90fOWF0',
  authDomain: 'simopo-vue.firebaseapp.com',
  projectId: 'simopo-vue',
  storageBucket: 'simopo-vue.appspot.com',
  messagingSenderId: '74935975108',
  appId: '1:74935975108:web:b4a2f49712f2a9a7959d91',
  measurementId: 'G-PZ5Q2DKG5M',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyBSxobmT7VyeQunr_y6LwysscqVS6YlgIA",
    authDomain: "guest-list-ea352.firebaseapp.com",
    databaseURL: "https://guest-list-ea352-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "guest-list-ea352",
    storageBucket: "guest-list-ea352.appspot.com",
    messagingSenderId: "675697900711",
    appId: "1:675697900711:web:edc1b0be9387d091052f82",
    measurementId: "G-LSKE0DTKBM"
  };

const app = initializeApp(firebaseConfig);

export default app;
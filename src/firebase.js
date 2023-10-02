import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVkSUTwMOWf4jE_TP7qsydDWVWvW5Mglk",
  authDomain: "react-konva-f31e1.firebaseapp.com",
  projectId: "react-konva-f31e1",
  storageBucket: "react-konva-f31e1.appspot.com",
  messagingSenderId: "30217815723",
  appId: "1:30217815723:web:95684713f48619ba7d59ee",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);

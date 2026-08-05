import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBrWfsmDxeDgmsmg3wxqwAUjwtDLnxt4_A",
    authDomain: "mar-wel-lab-86a7c.firebaseapp.com",
    projectId: "mar-wel-lab-86a7c",
    storageBucket: "mar-wel-lab-86a7c.firebasestorage.app",
    messagingSenderId: "430163655582",
    appId: "1:430163655582:web:950b7417d675b27adc748f",
    measurementId: "G-JEBRTKG9BT"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { app, auth, db };

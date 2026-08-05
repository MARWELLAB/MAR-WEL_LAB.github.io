import { auth, db } from "./firebase-config.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const loginForm = document.getElementById("loginForm");

const loginMessage = document.getElementById("loginMessage");


loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    loginMessage.textContent = "Checking login...";


    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;


        // Check administrator document
        const adminRef =
            doc(db, "users", user.uid);

        const adminSnap =
            await getDoc(adminRef);


        if (
            !adminSnap.exists() ||
            adminSnap.data().role !== "admin"
        ) {

            await auth.signOut();

            loginMessage.textContent =
                "You are not authorized as an administrator.";

            return;
        }


        // Successful login
        window.location.href =
            "admin-dashboard.html";

    }

        import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Your Firebase config
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

// Logout function
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "admin-login.html";  // Redirect to login page
  } catch (error) {
    console.error("Logout error:", error);
    alert("Failed to logout. Please try again.");
  }
    catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Login failed. Please check your email and password.";

    }

});

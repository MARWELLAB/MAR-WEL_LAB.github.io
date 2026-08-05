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

    catch (error) {

        console.error(error);

        loginMessage.textContent =
            "Login failed. Please check your email and password.";

    }

});

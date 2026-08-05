import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    getDoc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


const form =
    document.getElementById("publicationForm");

const table =
    document.getElementById("publicationTable");

const statusMessage =
    document.getElementById("statusMessage");

const logoutBtn =
    document.getElementById("logoutBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const adminEmail =
    document.getElementById("adminEmail");


let editingId = null;


// --------------------------------------------------
// CHECK LOGIN + ADMIN ROLE
// --------------------------------------------------

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "admin-login.html";

        return;
    }


    const adminRef =
        doc(db, "users", user.uid);

    const adminSnap =
        await getDoc(adminRef);


    if (
        !adminSnap.exists() ||
        adminSnap.data().role !== "admin"
    ) {

        await signOut(auth);

        window.location.href =
            "admin-login.html";

        return;
    }


    adminEmail.textContent =
        user.email;

    loadPublications();

});


// --------------------------------------------------
// LOAD PUBLICATIONS
// --------------------------------------------------

async function loadPublications() {

    table.innerHTML =
        "<p>Loading publications...</p>";

    try {

        const publicationsRef =
            collection(db, "publications");

        const q =
            query(
                publicationsRef,
                orderBy("year", "desc")
            );

        const snapshot =
            await getDocs(q);


        if (snapshot.empty) {

            table.innerHTML =
                "<p>No publications found.</p>";

            return;
        }


        let html = `
            <table class="admin-table">

                <thead>

                    <tr>

                        <th>Year</th>
                        <th>Title</th>
                        <th>Type</th>
                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>
        `;


        snapshot.forEach((publication) => {

            const data =
                publication.data();


            html += `

                <tr>

                    <td>
                        ${data.year || ""}
                    </td>

                    <td>
                        ${escapeHTML(data.title || "")}
                    </td>

                    <td>
                        ${escapeHTML(data.type || "")}
                    </td>

                    <td>

                        <button
                            class="edit-btn"
                            data-id="${publication.id}">
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            data-id="${publication.id}">
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        });


        html += `
                </tbody>
            </table>
        `;


        table.innerHTML = html;


        document
            .querySelectorAll(".edit-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => editPublication(button.dataset.id)
                );

            });


        document
            .querySelectorAll(".delete-btn")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => deletePublication(button.dataset.id)
                );

            });

    }

    catch (error) {

        console.error(error);

        table.innerHTML =
            "<p>Unable to load publications.</p>";

    }

}


// --------------------------------------------------
// ADD / UPDATE PUBLICATION
// --------------------------------------------------

form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const publication = {

        title:
            document.getElementById("title").value.trim(),

        authors:
            document.getElementById("authors").value.trim(),

        journal:
            document.getElementById("journal").value.trim(),

        year:
            Number(document.getElementById("year").value),

        doi:
            document.getElementById("doi").value.trim(),

        pdfUrl:
            document.getElementById("pdfUrl").value.trim(),

        type:
            document.getElementById("type").value,

        abstract:
            document.getElementById("abstract").value.trim(),

        updatedAt:
            serverTimestamp()

    };


    try {

        if (editingId) {

            const publicationRef =
                doc(
                    db,
                    "publications",
                    editingId
                );

            await updateDoc(
                publicationRef,
                publication
            );

            statusMessage.textContent =
                "Publication updated successfully.";

        }

        else {

            await addDoc(
                collection(db, "publications"),
                {
                    ...publication,
                    createdAt: serverTimestamp()
                }
            );

            statusMessage.textContent =
                "Publication added successfully.";

        }


        resetForm();

        loadPublications();

    }

    catch (error) {

        console.error(error);

        statusMessage.textContent =
            "Error saving publication.";

    }

});


// --------------------------------------------------
// EDIT
// --------------------------------------------------

async function editPublication(id) {

    try {

        const publicationRef =
            doc(db, "publications", id);

        const snapshot =
            await getDoc(publicationRef);


        if (!snapshot.exists()) {
            return;
        }


        const data =
            snapshot.data();


        editingId = id;


        document.getElementById(
            "formTitle"
        ).textContent =
            "Edit Publication";


        document.getElementById(
            "title"
        ).value =
            data.title || "";


        document.getElementById(
            "authors"
        ).value =
            data.authors || "";


        document.getElementById(
            "journal"
        ).value =
            data.journal || "";


        document.getElementById(
            "year"
        ).value =
            data.year || "";


        document.getElementById(
            "doi"
        ).value =
            data.doi || "";


        document.getElementById(
            "pdfUrl"
        ).value =
            data.pdfUrl || "";


        document.getElementById(
            "type"
        ).value =
            data.type || "Journal";


        document.getElementById(
            "abstract"
        ).value =
            data.abstract || "";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }

    catch (error) {

        console.error(error);

    }

}


// --------------------------------------------------
// DELETE
// --------------------------------------------------

async function deletePublication(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this publication?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await deleteDoc(
            doc(
                db,
                "publications",
                id
            )
        );


        statusMessage.textContent =
            "Publication deleted.";

        loadPublications();

    }

    catch (error) {

        console.error(error);

        statusMessage.textContent =
            "Unable to delete publication.";

    }

}


// --------------------------------------------------
// RESET FORM
// --------------------------------------------------

function resetForm() {

    editingId = null;

    form.reset();

    document.getElementById(
        "formTitle"
    ).textContent =
        "Add Publication";

}


// --------------------------------------------------
// CANCEL
// --------------------------------------------------

cancelBtn.addEventListener(
    "click",
    resetForm
);


// --------------------------------------------------
// LOGOUT
// --------------------------------------------------

logoutBtn.addEventListener(
    "click",
    async () => {

        await signOut(auth);

        window.location.href =
            "admin-login.html";

    }
);


// --------------------------------------------------
// BASIC HTML ESCAPE
// --------------------------------------------------

function escapeHTML(value) {

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}

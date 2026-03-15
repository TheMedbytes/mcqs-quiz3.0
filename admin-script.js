import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyDc-yEvFYvP8_OZedCyIqXjpEOnocOe87k",
    authDomain: "the-medbytes-4e614.firebaseapp.com",
    projectId: "the-medbytes-4e614",
    storageBucket: "the-medbytes-4e614.firebasestorage.app",
    messagingSenderId: "508245128582",
    appId: "1:508245128582:web:c4285259f6812a30026807",
    measurementId: "G-GYJ0EHS7M5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById('admin-mcq-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const mcqData = {
        subject: document.getElementById('adm-subject').value,
        question: document.getElementById('adm-question').value,
        optionA: document.getElementById('adm-optA').value,
        optionB: document.getElementById('adm-optB').value,
        optionC: document.getElementById('adm-optC').value,
        optionD: document.getElementById('adm-optD').value,
        optionE: document.getElementById('adm-optE').value,
        correctAnswer: document.getElementById('adm-correct').value,
        explanation: document.getElementById('adm-explanation').value,
        createdAt: new Date()
    };

    try {
        await addDoc(collection(db, "mcqs"), mcqData);
        alert("Success! MCQ added to MedBytes database.");
        form.reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error adding MCQ: " + error.message);
    }
});

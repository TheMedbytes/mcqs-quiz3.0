import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

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
const qCollection = collection(db, "mcqs");

// --- Handle Single Upload ---
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
        await addDoc(qCollection, mcqData);
        alert("Success! MCQ added to MedBytes database.");
        form.reset();
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error adding MCQ: " + error.message);
    }
});

// --- Handle Bulk Upload ---
const bulkBtn = document.getElementById('bulk-upload-btn');
bulkBtn.addEventListener('click', async () => {
    const jsonInput = document.getElementById('bulk-json-input').value;
    
    if (!jsonInput.trim()) return alert("Please paste JSON data first.");

    try {
        const questions = JSON.parse(jsonInput);
        
        if (!Array.isArray(questions)) {
            throw new Error("Data must be an array of questions [ {...}, {...} ]");
        }

        bulkBtn.disabled = true;
        bulkBtn.innerText = "Uploading... Please wait";

        let uploadCount = 0;
        for (const q of questions) {
            await addDoc(qCollection, {
                ...q,
                createdAt: new Date()
            });
            uploadCount++;
        }

        alert(`Success! ${uploadCount} questions uploaded.`);
        document.getElementById('bulk-json-input').value = '';
    } catch (error) {
        console.error("Bulk Upload Error:", error);
        alert("Upload Failed: " + error.message);
    } finally {
        bulkBtn.disabled = false;
        bulkBtn.innerText = "Upload All Questions";
    }
});

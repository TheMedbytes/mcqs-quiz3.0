import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

let currentQuestions = [];
let currentIndex = 0;
let score = { correct: 0, wrong: 0 };
let isExamMode = false;

async function initQuiz() {
    const sub = localStorage.getItem('sub');
    const mode = localStorage.getItem('mode');
    isExamMode = (mode === 'timed');

    // Fetch from Firestore instead of JSON for real-time updates
    const db = getFirestore();
    let qRef;
    
    if (sub === 'Random') {
        qRef = collection(db, "mcqs");
    } else {
        qRef = query(collection(db, "mcqs"), where("subject", "==", sub));
    }

    const querySnapshot = await getDocs(qRef);
    currentQuestions = querySnapshot.docs.map(doc => doc.data());

    // Shuffle and handle Mode
    currentQuestions.sort(() => Math.random() - 0.5);
    if(isExamMode) currentQuestions = currentQuestions.slice(0, 20);
    
    if(currentQuestions.length === 0) {
        alert("No questions found! Add some in the Admin Panel.");
        window.location.href = 'subjects.html';
        return;
    }

    showQuestion();
}

function showQuestion() {
    const q = currentQuestions[currentIndex];
    
    // Update UI Progress
    document.getElementById('q-progress').innerText = `${currentIndex + 1} / ${currentQuestions.length}`;
    document.getElementById('q-text').innerText = q.question;
    document.getElementById('progress-fill').style.width = ((currentIndex + 1) / currentQuestions.length * 100) + "%";
    
    const optCont = document.getElementById('options');
    optCont.innerHTML = '';
    
    // Handle options A through E
    ['optionA', 'optionB', 'optionC', 'optionD', 'optionE'].forEach((key, index) => {
        const letter = ['A', 'B', 'C', 'D', 'E'][index];
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = `${letter}: ${q[key]}`;
        btn.onclick = () => checkAns(letter, btn);
        optCont.appendChild(btn);
    });
}

function checkAns(selectedLetter, btn) {
    const q = currentQuestions[currentIndex];
    const btns = document.querySelectorAll('.opt-btn');
    
    // Disable all buttons after selection
    btns.forEach(b => b.disabled = true);
    
    const isCorrect = selectedLetter === q.correctAnswer;
    
    if(isCorrect) {
        btn.classList.add('correct');
        score.correct++;
    } else {
        btn.classList.add('wrong');
        score.wrong++;
        // Highlight the right answer for learning
        btns.forEach(b => {
            if(b.innerText.startsWith(q.correctAnswer)) b.classList.add('correct');
        });
    }

    // Show Explanation
    const expBox = document.getElementById('explanation-box');
    document.getElementById('explanation-text').innerText = q.explanation;
    expBox.classList.remove('hidden');

    // In Exam Mode, you might want to wait for a "Next" click instead of a timeout
    // In Practice Mode, a "Next" button is usually better than a 2-second jump
}

window.nextQuestion = () => {
    currentIndex++;
    if(currentIndex < currentQuestions.length) {
        document.getElementById('explanation-box').classList.add('hidden');
        showQuestion();
    } else {
        finishQuiz();
    }
};

function finishQuiz() {
    // Save results to Firebase for the Dashboard stats
    const accuracy = Math.round((score.correct / currentQuestions.length) * 100);
    alert(`Quiz Finished!\nScore: ${score.correct}/${currentQuestions.length}\nAccuracy: ${accuracy}%`);
    window.location.href = 'subjects.html';
}

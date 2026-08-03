// ==========================================
// Form Switching Logic
// ==========================================
function switchTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginBtn = document.getElementById('loginTabBtn');
    const registerBtn = document.getElementById('registerTabBtn');

    if (tab === 'login') {
        loginForm.classList.remove('hide-form');
        registerForm.classList.add('hide-form');
        loginBtn.classList.add('active');
        registerBtn.classList.remove('active');
    } else {
        loginForm.classList.add('hide-form');
        registerForm.classList.remove('hide-form');
        loginBtn.classList.remove('active');
        registerBtn.classList.add('active');
    }
}

// Prevent default form reloads
document.getElementById('signInForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Sign in successful!');
});

document.getElementById('signUpForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Account created successfully!');
});


// ==========================================
// Interactive Quiz Logic
// ==========================================
const quizData = [
    {
        question: "What does SaaS stand for?",
        options: ["Software as a Service", "System as a Service", "Storage as a Service", "Software and Analytics System"],
        correct: 0
    },
    {
        question: "Which technology is primarily used for styling web apps?",
        options: ["HTML", "JavaScript", "CSS", "Node.js"],
        correct: 2
    },
    {
        question: "What is the primary function of Express in Node.js?",
        options: ["Database Management", "Building Backend APIs", "Frontend Rendering", "Version Control"],
        correct: 1
    }
];

let currentQuestionIndex = 0;
let score = 0;

function loadQuestion() {
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    
    // Clear previous options
    optionsContainer.innerHTML = '';

    const currentQuiz = quizData[currentQuestionIndex];
    questionText.textContent = currentQuiz.question;

    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsContainer.appendChild(button);
    });
}

function selectOption(selectedIndex) {
    const currentQuiz = quizData[currentQuestionIndex];
    
    if (selectedIndex === currentQuiz.correct) {
        score += 10;
        document.getElementById('score').textContent = score;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showWinner();
    }
}

function showWinner() {
    document.getElementById('quizBody').classList.add('hide');
    document.getElementById('winnerSection').classList.remove('hide');
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('quizBody').classList.remove('hide');
    document.getElementById('winnerSection').classList.add('hide');
    loadQuestion();
}

// Initialize quiz on load
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
});

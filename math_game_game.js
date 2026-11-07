let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let studentInfo = {};
let selectedStep = null;

function startGame() {
    const className = document.getElementById('class-input').value.trim();
    const seatNo = document.getElementById('seat-input').value.trim();
    const name = document.getElementById('name-input').value.trim();

    if (!className || !seatNo || !name) {
        alert('請完整填寫班級、座號與姓名！');
        return;
    }

    studentInfo = { className, seatNo, name };

    // 隨機抽 10 題
    currentQuestions = [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 10);
    currentIndex = 0;
    score = 0;

    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');

    loadQuestion();
}

function loadQuestion() {
    selectedStep = null;
    document.getElementById('feedback-box').classList.add('hidden');
    document.getElementById('next-btn').classList.add('hidden');
    document.getElementById('reason-section').classList.add('hidden');

    const q = currentQuestions[currentIndex];
    document.getElementById('progress-text').innerText = `第 ${currentIndex + 1} 題 / 共 10 題`;
    document.getElementById('score-text').innerText = `得分：${score}`;
    document.getElementById('question-title').innerText = q.question;

    const stepsContainer = document.getElementById('incorrect-steps');
    stepsContainer.innerHTML = '';
    q.incorrect_steps.forEach((step, idx) => {
        const div = document.createElement('div');
        div.innerText = `${step}`;
        stepsContainer.appendChild(div);
    });

    // 步驟選項
    const stepOptions = document.getElementById('step-options');
    stepOptions.innerHTML = '';
    
    q.incorrect_steps.forEach((_, idx) => {
        const stepName = `步驟${['一', '二', '三'][idx] || idx+1}`;
        const btn = document.createElement('button');
        btn.className = "p-3 border-2 rounded-xl font-bold text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 transition text-center";
        btn.innerText = stepName;
        btn.onclick = () => selectStep(stepName, q);
        stepOptions.appendChild(btn);
    });
}

function selectStep(stepName, q) {
    selectedStep = stepName;
    
    const buttons = document.querySelectorAll('#step-options button');
    buttons.forEach(b => {
        if (b.innerText === stepName) {
            b.className = "p-3 border-2 border-indigo-600 bg-indigo-50 rounded-xl font-bold text-indigo-700 transition text-center";
        } else {
            b.className = "p-3 border-2 rounded-xl font-bold text-slate-700 hover:border-indigo-500 hover:bg-indigo-50 transition text-center";
        }
    });

    const reasonSection = document.getElementById('reason-section');
    reasonSection.classList.remove('hidden');

    const reasonOptions = document.getElementById('reason-options');
    reasonOptions.innerHTML = '';

    let options = [q.explanation, ...q.distractors].sort(() => 0.5 - Math.random());

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left p-3 border rounded-xl text-sm hover:bg-slate-50 transition font-medium";
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt === q.explanation, selectedStep === q.error_step, q);
        reasonOptions.appendChild(btn);
    });
}

function checkAnswer(isReasonCorrect, isStepCorrect, q) {
    const feedbackBox = document.getElementById('feedback-box');
    feedbackBox.classList.remove('hidden');

    if (isStepCorrect && isReasonCorrect) {
        score += 10;
        feedbackBox.className = "p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800";
        feedbackBox.innerHTML = `<strong>答對了！</strong><br>${q.explanation}`;
    } else {
        feedbackBox.className = "p-4 rounded-xl border bg-rose-50 border-rose-200 text-rose-800";
        feedbackBox.innerHTML = `<strong>答錯囉！</strong>正確答案應發生在 <strong>${q.error_step}</strong>。<br><strong>正確觀念：</strong>${q.explanation}`;
    }

    const allBtns = document.querySelectorAll('#step-options button, #reason-options button');
    allBtns.forEach(b => b.disabled = true);

    document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex < currentQuestions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    document.getElementById('final-score').innerText = `您的總得分：${score} 分`;
    document.getElementById('student-info-summary').innerText = `考生：${studentInfo.className} 班 ${studentInfo.seatNo} 號 ${studentInfo.name}`;
}

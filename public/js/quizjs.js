var questRight = false;
var totalScore = 0;
var questScore = 3000;
var questCount = 0;
var q;
var timer;
var interval;
var seenQuestions = [];
var hasLoaded = false;

function loadQuestion() {
    if (hasLoaded && seenQuestions.length === 0) return; 
        hasLoaded = true;
    const mediatype = document.getElementById('mediatype')?.dataset.value || null;
    const region = document.getElementById('region')?.dataset.value || null;

    let url;
    const exclude = seenQuestions.length > 0 ? `?exclude=${seenQuestions.join(',')}` : '';

    if (mediatype && mediatype !== 'null' && mediatype !== '') {
        url = `/api/question/media/${mediatype}${exclude}`;
    } else if (region && region !== 'null' && region !== '') {
        url = `/api/question/region/${region}${exclude}`;
    } else {
        url = `/api/question${exclude}`;
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data.success || !data.question) throw new Error('No more questions');
            
            q = data.question;
            if (q.q_id && !seenQuestions.includes(q.q_id)) {
                seenQuestions.push(q.q_id);
            }

            document.getElementById('question').textContent = q.question;
            document.getElementById('A').textContent = q.option_a;
            document.getElementById('B').textContent = q.option_b;
            document.getElementById('C').textContent = q.option_c;
            document.getElementById('D').textContent = q.option_d;
            document.getElementById('answer').textContent = q.answer;

            document.getElementById('timer-bar').style.width = '100%';
            document.getElementById('timer-bar').style.background = '#4caf50';
            questScore = 3000;
            interval = setInterval(updater, 10);
        })
        .catch(err => {
            const mode = (mediatype && mediatype !== 'null') || (region && region !== 'null') ? 'short' : 'freeplay';
            quizEnd(mode);
        });
}

function updater() {
    questScore = questScore - 1;
    const pct = (questScore / 3000) * 100;
    const bar = document.getElementById('timer-bar');
    if (bar) {
        bar.style.width = pct + '%';
        if (pct <= 33) bar.style.background = '#e53935';
        else if (pct <= 66) bar.style.background = '#fbc02d';
        else bar.style.background = '#4caf50';
    }
    if (questScore <= 0) {
        clearInterval(interval);
        lostTime();
    }
}

function questionEnd() {
    const answer = document.getElementById('answer').textContent;
    const correctEl = document.getElementById(answer);
    if (correctEl) {
        correctEl.style.backgroundColor = "#70683b";
        correctEl.style.color = "white";
    }
    document.getElementById('nextButton').style.display = "flex";
}

function clicked(element, char) {
    if (document.getElementById('nextButton').style.display === "flex") return; 
    clearInterval(interval);
    clearTimeout(timer);
    if (char !== document.getElementById('answer').textContent) {
        element.style.backgroundColor = "#81231e";
        element.style.color = "white";
    } else {
        element.style.backgroundColor = "#70683b";
        element.style.color = "white";
        totalScore = totalScore + questScore;
        questRight = true;
    }
    questCount = questCount + 1;
    questionEnd();
}

function lostTime() {
    const bar = document.getElementById('timer-bar');
    if (bar) bar.style.width = '0%';
    clearInterval(interval);
    clearTimeout(timer);
    questRight = false;
    ['A', 'B', 'C', 'D'].forEach(id => document.getElementById(id).style.pointerEvents = 'none');
    const answer = document.getElementById('answer').textContent;
    const correctEl = document.getElementById(answer);
    if (correctEl) {
        correctEl.style.backgroundColor = "#70683b";
        correctEl.style.color = "white";
    }
    questCount = questCount + 1;
    document.getElementById('nextButton').style.display = "flex";
}

function questionReset() {
    hasLoaded = false;
    questScore = 3000;
    questRight = false;
    ['A', 'B', 'C', 'D'].forEach(id => {
        const el = document.getElementById(id);
        el.style.backgroundColor = "#e7e1d8";
        el.style.color = "";
        el.style.pointerEvents = '';
    });
    document.getElementById('nextButton').style.display = "none";
    document.getElementById('timer-bar').style.width = '100%';
    document.getElementById('timer-bar').style.background = '#4caf50';
    loadQuestion();
}

function quizEnd(mode) {
    clearInterval(interval);
    clearTimeout(timer);
    document.getElementById('timer-container').style.display = 'none';
    document.getElementById('head').style.display = "none";
    ['A', 'B', 'C', 'D', 'nextButton'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
    document.getElementById('score').innerHTML = totalScore;
    document.getElementById('qc').innerHTML = questCount;
    document.getElementById('scorePopup').style.display = 'block';

    const isLoggedIn = document.getElementById('isLoggedIn')?.dataset.value === 'true';
    if (!isLoggedIn) return;

    fetch('/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: totalScore, quizType: mode }),
    });

    const endpoint = mode === 'short' ? '/quiz/bite' : '/quiz/freeplay';
    fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: totalScore }),
    }).catch(error => console.error('Submission error: ' + error.message));
}

function next(mode) {
    if (mode === 's') {
        if (questCount >= 5) quizEnd('short'); 
        else questionReset();
    } else {
        if (!questRight) quizEnd('freeplay');
        else questionReset();
    }
}

document.addEventListener('DOMContentLoaded', loadQuestion);

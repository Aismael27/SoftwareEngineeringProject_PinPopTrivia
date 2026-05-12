var questRight = false;
var totalScore = 0;
var questScore = 3000;
var questCount = 0;
var q;
var timer;
var interval;

function loadQuestion() {
    const mediatype = document.getElementById('media_type')?.dataset.value || null;
    const region = document.getElementById('region')?.dataset.value || null;

    let url;
    if (mediatype) {
        url = `/api/question/media/${mediatype}`;
    } else if (region) {
        url = `/api/question/region/${region}`;
    } else {
        url = '/api/question';
    }

    fetch(url)
        .then(res => res.json())
        .then(data => {
            q = data.question;
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
            document.getElementById('question').textContent = 'Failed to load question: ' + err.message;
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
    if (answer == 'A') {
        document.getElementById('A').style.backgroundColor = "#70683b";
        document.getElementById('A').style.color = "white";
    } else if (answer == 'B') {
        document.getElementById('B').style.backgroundColor = "#70683b";
        document.getElementById('B').style.color = "white";
    } else if (answer == 'C') {
        document.getElementById('C').style.backgroundColor = "#70683b";
        document.getElementById('C').style.color = "white";
    } else if (answer == 'D') {
        document.getElementById('D').style.backgroundColor = "#70683b";
        document.getElementById('D').style.color = "white";
    }
    document.getElementById('nextButton').style.display = "flex";
}

function clicked(element, char) {
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
    document.getElementById('A').style.pointerEvents = 'none';
    document.getElementById('B').style.pointerEvents = 'none';
    document.getElementById('C').style.pointerEvents = 'none';
    document.getElementById('D').style.pointerEvents = 'none';
    const answer = document.getElementById('answer').textContent;
    document.getElementById(answer).style.backgroundColor = "#70683b";
    document.getElementById(answer).style.color = "white";
    questCount = questCount + 1;
    document.getElementById('nextButton').style.display = "flex";
}

function questionReset() {
    questScore = 3000;
    questRight = false;
    document.getElementById('A').style.backgroundColor = "#e7e1d8";
    document.getElementById('B').style.backgroundColor = "#e7e1d8";
    document.getElementById('C').style.backgroundColor = "#e7e1d8";
    document.getElementById('D').style.backgroundColor = "#e7e1d8";
    document.getElementById('A').style.color = "";
    document.getElementById('B').style.color = "";
    document.getElementById('C').style.color = "";
    document.getElementById('D').style.color = "";
    document.getElementById('A').style.pointerEvents = '';
    document.getElementById('B').style.pointerEvents = '';
    document.getElementById('C').style.pointerEvents = '';
    document.getElementById('D').style.pointerEvents = '';
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
    document.getElementById('A').style.display = "none";
    document.getElementById('B').style.display = "none";
    document.getElementById('C').style.display = "none";
    document.getElementById('D').style.display = "none";
    document.getElementById('next').style.display = "none";
    //for the scores at the end
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
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('Submission failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Submission error: ' + error.message);
    });
}

function next(mode) {
    if (mode === 's') {
        if (questCount > 4){
            quizEnd('short'); 
        } else {
            questionReset();
        }
    } else {
        if (!questRight) {
            quizEnd('freeplay');
        } else {
            questionReset();
        }
    }
}

document.addEventListener('DOMContentLoaded', loadQuestion);

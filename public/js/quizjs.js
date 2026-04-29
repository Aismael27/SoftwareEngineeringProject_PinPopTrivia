var questRight = false;
var totalScore = 0;
var questScore = 3000;
var questCount = 0;
var q;
var timer;
var interval;

function loadQuestion() {
    const mediatype = document.getElementById('mediatype')?.dataset.value || null;
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

            interval = setInterval(updater, 10);
            timer = setTimeout(lostTime, 30000);
        })
        .catch(err => {
            document.getElementById('question').textContent = 'Failed to load question: ' + err.message;
        });
}

function updater() {
    questScore = questScore - 1;
}

function questionEnd() {
    const answer = document.getElementById('answer').textContent;
    if (answer == 'A') {
        document.getElementById('A').style.backgroundColor = "#70683b";
    } else if (answer == 'B') {
        document.getElementById('B').style.backgroundColor = "#70683b";
    } else if (answer == 'C') {
        document.getElementById('C').style.backgroundColor = "#70683b";
    } else if (answer == 'D') {
        document.getElementById('D').style.backgroundColor = "#70683b";
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
        totalScore = totalScore + questScore;
        questRight = true;
    }
    questCount = questCount + 1;
    questionEnd();
}

function lostTime() {
    clearInterval(interval);
    questCount = questCount + 1;
    questionEnd();
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
    document.getElementById('nextButton').style.display = "none";
    loadQuestion();
}

function quizEnd() {
    document.getElementById('head').style.display = "none";
    document.getElementById('A').style.display = "none";
    document.getElementById('B').style.display = "none";
    document.getElementById('C').style.display = "none";
    document.getElementById('D').style.display = "none";
    document.getElementById('next').style.display = "none";
    document.getElementById('end').style.display = "flex";
    document.getElementById('score').style.display = "flex";
    document.getElementById('qc').style.display = "flex";
    document.getElementById('score').innerHTML = totalScore;
    document.getElementById('qc').innerHTML = questCount;
    if(user){
        fetch('/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalScore }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Quiz submitted successfully!');
                window.location.href = '/';
            } else {
                alert('Submission failed: ' + data.message);
            }
        })
        .catch(error => {
            document.getElementById('question').textContent = 'Submission error: ' + error.message;
        });
    }
}

function next(mode) {
    if (mode === 's') {
        if (questCount > 4){
            quizEnd(); 
        } else {
            questionReset();
        }
    } else {
        if (!questRight) {
            quizEnd();
        } else {
            questionReset();
        }
    }
}

document.addEventListener('DOMContentLoaded', loadQuestion);

var isQuizOver = false;
var totalScore = 0;
var questScore = 3000;
var gamemode = 's'; // change to 'f' for freeplay mode
setTimeout(lostTime(), 30000)
setInterval(updater(), 10)
var questCount = 0; 

function loadQuestion() {
    fetch('/api/question')
        .then(res => res.json())
        .then(data => {
            const q = data.question;
            
            document.getElementById('question').textContent = q.question;
            document.getElementById('A').textContent = q.option_a;
            document.getElementById('B').textContent = q.option_b;
            document.getElementById('C').textContent = q.option_c;
            document.getElementById('D').textContent = q.option_d;
            document.getElementById('answer').textContent = q.answer;
        }
    );
}
function updater(){
    questscore = questScore - 1;
}
function questionEnd(){
    const answer = document.getElementById('answer').textContent;
    if (answer == 'A'){
        document.getElementById('A').style.backgroundColor = "#70683b";
    } else if (answer == 'B'){
        document.getElementById('B').style.backgroundColor = "#70683b";
    } else if (answer == 'C'){
        document.getElementById('C').style.backgroundColor = "#70683b";
    } else if (answer == 'D') {
        document.getElementById('D').style.backgroundColor = "#70683b";
    } // reveals the Correct answer
    document.getElementById('nextButton').style.display = "flex";
    // reveals next button
}
function clicked (element, char){
    clearInterval();
    clearTimeout();
    if(char !== document.getElementById('answer').textContent){
        element.style.backgroundColor = "#81231e";
        if (gamemode = 'f'){
            isQuizOver = true;
        }
    } else {
        totalScore = totalScore + questScore;
    }
    questCount = questCount+1;
    if ((gamemode === 's') && questCount > 4){
        isQuizOver = true;
    }
    questionEnd();
}
function lostTime(){
    clearInterval();
    questCount + 1;
    if((gamemode ==='s') && questCount > 4){
        isQuizOver = true;
        questionEnd();
    }
    if((gamemode === 'f')){
        isQuizOver = true;
        questionEnd();
    }
}
function questionReset(){
    loadQuestion();
    setInterval(updater(), 10)
    setTimeout(lostTime(), 30000);
    questScore = 3000;
    document.getElementById('A').style.backgroundColor = "#e7e1d8";
    document.getElementById('B').style.backgroundColor = "#e7e1d8";
    document.getElementById('C').style.backgroundColor = "#e7e1d8";
    document.getElementById('D').style.backgroundColor = "#e7e1d8";
    document.getElementById('nextButton').style.display = "none";
}
function quizEnd() {
    document.getElementsByClassName("quiz_head").style.display = "none";
    document.getElementsByClassName("quiz_body").style.display = "none";
    document.getElementsByClassName("next").style.display = "none";
    document.getElementsByClassName("scoreText").style.display = "flex";
    document.getElementById("score").innerHTML = totalScore;
    document.getElementById("qc").innerHTML = questCount;
    fetch('/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({totalScore}),
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
        console.error('Error during submission:', error);
        alert('An error occurred. Please try again later.');
    });
}
function next(){
    if (isQuizOver){
        quizEnd();
    }
    else{
        questionReset();
    }
}
document.addEventListener('DOMContentLoaded', loadQuestion);

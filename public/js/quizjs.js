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
document.addEventListener('DOMContentLoaded', loadQuestion);

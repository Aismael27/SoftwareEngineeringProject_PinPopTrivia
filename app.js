const express = require('express');
const connection = require('./database.js').databaseConnection;
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

app.get('/test', (req, res) => {
    res.render('pages/test');
});
app.get('/', (req, res) => {
    res.render('pages/home');
});
app.get('/freeplay', (req, res) => {
    res.render('pages/freeplay');
});
app.get('/leaderboard', (req, res) => {
    res.render('pages/leaderboard');
});
app.get('/login', (req, res) => {
    res.render('pages/login');
});
app.get('/quiz', (req, res) => {
    res.render('pages/quiz');
});
app.get('/sanAntonio', (req, res) => {
    res.render('pages/sanAntonio');
});
app.get('/suggest', (req, res) => {
    res.render('pages/suggest');
});
app.get('/weeklyQuiz', (req, res) => {
    res.render('pages/weeklyQuiz');
}); 


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
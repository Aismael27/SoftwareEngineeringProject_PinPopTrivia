const express = require('express');
const connection = require('./database.js').databaseConnection;
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

app.get('/test', (req, res) => {
    res.render('test');
});
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/leaderboard', (req, res) => {
    res.render('leaderboard');
});
app.get('/login', (req, res) => {
    res.render('login');
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
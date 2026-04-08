const express = require('express');
const connection = require('./database.js').databaseConnection;
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
    try {
        let sql = 
        `SELECT location_id, city_name
        FROM location;`;    
        connection.query(sql, (err, cities) => {
        if (err) throw err;
        res.render('pages/home', {cities: cities});
        });
    }
    catch (err) {
        console.error(err);
        res.send("Error loading page");
    }
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
app.get('/city/:cityid', (req, res) => {
    const cityid = req.params.cityid;

    let sql = 'SELECT * FROM location WHERE location_id = ?';
    connection.query(sql, [cityid], (err, city) => {
        if (err) throw err;
        res.render('pages/cityPage', {city: city[0]});
    });
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
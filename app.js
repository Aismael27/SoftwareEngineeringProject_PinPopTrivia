const express = require('express');
const connection = require('./database.js').databaseConnection;
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

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

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Check admin table for admin password
    connection.query('SELECT * FROM admin WHERE email = ? AND password = ?', [email, password], (err, adminResults) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (adminResults.length > 0) {
            return res.json({ success: true, role: 'admin' });
        }
        // Check player table for account
        connection.query('SELECT * FROM player WHERE email = ? AND password = ?', [email, password], (err, playerResults) => {
            if (err) return res.status(500).json({ success: false, message: 'Database error' });
            if (playerResults.length > 0) {
                return res.json({ success: true, role: 'player' });
            }
            // Not found in either table
            return res.json({ success: false, message: 'Invalid email or password' });
        });
    });
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
app.get('/profile', (req, res) => {
    res.render('pages/profile');
}); 


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
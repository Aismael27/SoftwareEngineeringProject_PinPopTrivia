const express = require('express');
const session = require('express-session');
const connection = require('./database.js').databaseConnection;
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.get('/', (req, res) => {
    try {
        let sql = 
        `SELECT location_id, city_name
        FROM location
        ORDER BY city_name;`;    
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
    connection.query('SELECT username, freeplay_score FROM player ORDER BY freeplay_score DESC LIMIT 25', (err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.render('pages/leaderboard', { users });
    });
});
app.get('/login', (req, res) => {
    res.render('pages/login');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM admin WHERE email = ? AND password = ?', [email, password], (err, adminResults) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (adminResults.length > 0) {
            req.session.user = { email, role: 'admin' };
            return res.json({ success: true, role: 'admin' });
        }
        connection.query('SELECT * FROM player WHERE email = ? AND password = ?', [email, password], (err, playerResults) => {
            if (err) return res.status(500).json({ success: false, message: 'Database error' });
            if (playerResults.length > 0) {
                req.session.user = { username: playerResults[0].username, email, role: 'player' };
                return res.json({ success: true, role: 'player' });
            }
            return res.json({ success: false, message: 'Invalid email or password' });
        });
    });
});

function getRole(req) {
    if (!req.session.user) return 'guest';
    return req.session.user.role;
}

app.get('/profile', (req, res) => {
    const role = getRole(req);
    if (role === 'guest') return res.redirect('/login');
    res.render('pages/profile', { user: req.session.user });
});
app.post('/profile/deleteAccount', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'player') return res.status(403).json({ success: false });
    const { submission_id, status } = req.body;
    connection.query(
        'UPDATE player SET is_deleted = ? WHERE email = ?',
        [true, req.session.user.email],
        (err) => {
            if (err) return res.json({ success: false });
            res.json({ success: true });
        }
    );
});

app.get('/adminDashboard', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/');
    const status = req.query.status || 'pending';
    connection.query(
        `SELECT c.*, p.username FROM contact c 
         LEFT JOIN player p ON c.player_id = p.player_id 
         WHERE c.status = ? ORDER BY c.submitted_date DESC`,
        [status],
        (err, submissions) => {
            if (err) return res.status(500).send('Database error');
            res.render('pages/adminDashboard', { submissions, currentStatus: status });
        }
    );
});
app.post('/adminDashboard/updateStatus', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.status(403).json({ success: false });
    
    const { submission_id, status } = req.body;
    connection.query(
        'UPDATE contact SET status = ?, admin_review = ? WHERE submission_id = ?',
        [status, req.session.user.admin_id, submission_id],
        (err) => {
            if (err) return res.json({ success: false });
            res.json({ success: true });
        }
    );
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
    return res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/register', (req, res) => {
    res.render('pages/register');
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    connection.query('SELECT * FROM player WHERE email = ? OR username = ?', [email, username], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (results.length > 0) {
            const emailTaken = results.some(r => r.email === email);
            const usernameTaken = results.some(r => r.username === username);    
            if (emailTaken) return res.json({ success: false, message: 'Email already in use' });
            if (usernameTaken) return res.json({ success: false, message: 'Username already taken' });
        }
        connection.query('INSERT INTO player (username, email, password) VALUES (?, ?, ?)', [username, email, password], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: 'Database error' });
            req.session.user = { username, email, role: 'player' };
            return res.json({ success: true, message: 'User registered successfully' });
        });
    });
});

app.get('/quiz', (req, res) => {
    res.render('pages/quiz');
});
app.post('/quiz', (req, res) => {
    const {score} = req.body;
    const player = req.session.user.player_id;
    const quizType = 'short';


    connection.query(
        'INSERT INTO quiz (player_id, quiz_type, score) VALUES (?, ?, ?)', [player, quizType, score],
        (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Database error' });
            return res.json({ success: true, message: 'Question suggestion submitted successfully' });
        });
    return res.json({ success: true, message: 'Guest user, no data submitted.' });
});

app.get('/api/question', (req, res) => {
    let sql = 
    `SELECT * 
    FROM questions 
    ORDER BY RAND()
    LIMIT 1;`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }

        const q = results[0];

        res.json({
            success: true,
            question: {
                question: q.question,
                option_a: q.option_a,
                option_b: q.option_b,
                option_c: q.option_c,
                option_d: q.option_d,
                answer: q.answer
            }
        });
    });
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

app.post('/suggest', (req, res) => {
    const { submissionType, message, question, optionA, optionB, optionC, optionD, answer } = req.body;
    const playerEmail = req.session.user.email;

    connection.query(
        'INSERT INTO contact (player_id, submission_type, message, question_text, option_A, option_B, option_C, option_D, correct_option) VALUES ((SELECT player_id FROM player WHERE email = ?), ?, ?, ?, ?, ?, ?, ?, ?)',
        [playerEmail, submissionType, message, question, optionA, optionB, optionC, optionD, answer],
        (err) => {
            if (err) return res.status(500).json({ success: false, message: 'Database error' });
            return res.json({ success: true, message: 'Question suggestion submitted successfully' });
        }
    );
});

app.get('/profile', (req, res) => {
    res.render('pages/profile');
}); 

app.get('/admin/questionManagement', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/');
    connection.query('SELECT * FROM questions ORDER BY date_added DESC', (err, questions) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.render('pages/admin/questionManagement', { questions });
    }); 
});

app.get('/admin/userManagement', (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') return res.redirect('/');
    connection.query('SELECT * FROM player ORDER BY date_join DESC', (err, users) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Database error');
        }
        res.render('pages/admin/userManagement', { users });
    });
});


app.listen(3000, () => {
  console.log('Server running on port 3000');
});
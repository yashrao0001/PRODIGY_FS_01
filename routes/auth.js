const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const app = express();

const router = express.Router();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Home route
router.get("/",(req,res)=>{
  res.render("./dashboard/Home")
})

// Registration handler
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Login page
// router.get('/login', (req, res) => {
//   res.render('./dashboard/Home');
// });

// Login handler
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        req.session.userId = user.id;
        req.session.username = user.username; // Store username in the session
        req.session.userRole = user.role;
        res.redirect('/dashboard');
      } else {
        res.send('Invalid credentials');
      }
    } else {
      res.send('User not found');
    }
  });
});


// Protected route
router.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  res.render('./dashboard/dashboard', { username: req.session.username });
  console.log(req.session.username);
});

// Logout handler
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [results] = await db.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (results.length > 0) {
      req.session.loggedIn = true;
      res.redirect('/dashboard');
    } else {
      res.redirect('/login.html?error=1'); // Redirect ke halaman login dengan parameter error
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

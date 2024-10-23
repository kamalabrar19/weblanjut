const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const router = express.Router();

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'office_db'
});


  db.execute(query, [username], (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      const user = result[0];
      if (bcrypt.compareSync(password, user.password)) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/dashboard');
      } else {
        res.send('Incorrect password');
      }
    } else {
      res.send('User not found');
    }
  });

// Dashboard route
router.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard');
});

// CRUD for office equipment
router.get('/equipment', isLoggedIn, (req, res) => {
  db.query('SELECT * FROM equipment', (err, result) => {
    if (err) throw err;
    res.render('equipment', { equipment: result });
  });
});

router.post('/equipment/add', isLoggedIn, (req, res) => {
  const { name, type, quantity } = req.body;
  const query = 'INSERT INTO equipment (name, type, quantity) VALUES (?, ?, ?)';

  db.execute(query, [name, type, quantity], (err) => {
    if (err) throw err;
    res.redirect('/equipment');
  });
});

router.post('/equipment/edit/:id', isLoggedIn, (req, res) => {
  const { name, type, quantity } = req.body;
  const query = 'UPDATE equipment SET name = ?, type = ?, quantity = ? WHERE id = ?';

  db.execute(query, [name, type, quantity, req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/equipment');
  });
});

router.post('/equipment/delete/:id', isLoggedIn, (req, res) => {
  const query = 'DELETE FROM equipment WHERE id = ?';

  db.execute(query, [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/equipment');
  });
});

module.exports = router;

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Koneksi ke database MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'office_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to MySQL database.');
  }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API untuk mendapatkan semua data
app.get('/api/equipment', (req, res) => {
  const sql = 'SELECT * FROM equipment';
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(results);
  });
});

// API untuk menambahkan data
app.post('/api/equipment', (req, res) => {
  const { name, type, quantity } = req.body;
  const sql = 'INSERT INTO equipment (name, type, quantity) VALUES (?, ?, ?)';
  db.query(sql, [name, type, quantity], (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ message: 'Data berhasil ditambahkan!' });
  });
});

// API untuk mengupdate data
app.put('/api/equipment/:id', (req, res) => {
  const { name, type, quantity } = req.body;
  const sql = 'UPDATE equipment SET name = ?, type = ?, quantity = ? WHERE id = ?';
  db.query(sql, [name, type, quantity, req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ message: 'Data berhasil diperbarui!' });
  });
});

// API untuk menghapus data
app.delete('/api/equipment/:id', (req, res) => {
  const sql = 'DELETE FROM equipment WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json({ message: 'Data berhasil dihapus!' });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

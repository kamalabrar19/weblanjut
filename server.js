// server.js

const express = require('express');
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const open = require('open');


const app = express();

// Konfigurasi koneksi MySQL
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root', // Ganti dengan username MySQL Anda
    password : '', // Ganti dengan password MySQL Anda
    database : 'office_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Terhubung ke database MySQL.');
});

// Middleware
app.use(session({
    secret: 'your_secret_key', // Ganti dengan secret key Anda
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// Menyajikan file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Route untuk login
app.post('/auth', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
            if (error) throw error;
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/index.html');
            } else {
                res.send('Username atau Password salah!');
            }			
            res.end();
        });
    } else {
        res.send('Silakan masukkan Username dan Password!');
        res.end();
    }
});

// Middleware untuk memeriksa apakah user sudah login
function requireLogin (req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.redirect('/login.html');
    }
}

// Proteksi route index.html
app.get('/index.html', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// API routes untuk operasi CRUD
app.get('/api/equipment', requireLogin, (req, res) => {
    connection.query('SELECT * FROM equipment', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.post('/api/equipment', requireLogin, (req, res) => {
    const equipment = {name: req.body.name, type: req.body.type, quantity: req.body.quantity};
    connection.query('INSERT INTO equipment SET ?', equipment, (error, results) => {
        if (error) throw error;
        res.json({id: results.insertId, ...equipment});
    });
});

app.put('/api/equipment/:id', requireLogin, (req, res) => {
    const id = req.params.id;
    const equipment = {name: req.body.name, type: req.body.type, quantity: req.body.quantity};
    connection.query('UPDATE equipment SET ? WHERE id = ?', [equipment, id], (error) => {
        if (error) throw error;
        res.json({id: id, ...equipment});
    });
});

app.delete('/api/equipment/:id', requireLogin, (req, res) => {
    const id = req.params.id;
    connection.query('DELETE FROM equipment WHERE id = ?', [id], (error) => {
        if (error) throw error;
        res.json({id: id});
    });
});

// Menjalankan server
app.listen(3000, () => {
    console.log('Terhubung ke database MySQL.');
    console.log('Server berjalan di port 3000.');
    console.log('login dulu ya bosss');
    open('http://localhost:3000/login.html');
});


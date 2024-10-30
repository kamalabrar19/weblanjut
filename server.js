const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const kantorRoutes = require('./routes/kantor');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Redirect root to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.loggedIn) {
    return next();
  }
  res.redirect('/login.html');
}

app.use('/auth', authRoutes);
app.use('/kantor', isAuthenticated, kantorRoutes);

// Protected route for dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'protected', 'dashboard.html'));
});

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

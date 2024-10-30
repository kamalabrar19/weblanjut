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
  secret: process.env.SESSION_SECRET || 'your_strong_secret_key', // Use environment variable for secret key
  resave: false,
  saveUninitialized: false, // Changed to false to avoid saving uninitialized sessions
  cookie: {
    httpOnly: true, // Helps mitigate XSS attacks
    secure: false, // Set to true if using HTTPS
    maxAge: 60000 * 60 // Session expires after 1 hour
  }
}));

// Redirect root to login or dashboard if already logged in
app.get('/', (req, res) => {
  if (req.session && req.session.loggedIn) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/login.html');
  }
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.loggedIn) {
    return next();
  }
  res.redirect('/login.html');
}

// Routes
app.use('/auth', authRoutes);
app.use('/kantor', isAuthenticated, kantorRoutes);

// Protected route untuk dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'protected', 'dashboard.html'));
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to logout');
    }
    res.redirect('/login.html');
  });
});

app.listen(3000, async () => {
  console.log('Server started on http://localhost:3000');


  const open = (await import('open')).default;
  open('http://localhost:3000/login.html');
});

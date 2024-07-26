const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const path = require("path");
const ejsMate = require("ejs-mate")

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")))
app.use(session({
  secret: 'Rao@1234',
  resave: false,
  saveUninitialized: true
}));

app.set('view engine', 'ejs');

// Routes
app.use('/', authRoutes);

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

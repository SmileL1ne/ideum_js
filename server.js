const dbConn = require('./config/db')
const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');

const PORT = process.env.PORT || 3000
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Session middleware
app.use(session({
  secret: 'mustik-session',
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
dbConn()

// Routes
app.use('/auth', authRoutes);


app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
const dbConn = require('./config/db')
const express = require('express');
const session = require('express-session');
const { static } = require('express');
const isAuthenticatedAsAdmin = require('./middlewares/authAdmin')

const PORT = process.env.PORT || 3000
const app = express();

app.set('view engine', 'ejs');
app.use('/uploads/', static('uploads/'));

app.get('/scripts/lingumania.js', (req, res) => {
  res.sendFile(__dirname + '/scripts/lingumania.js');
});

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
const authRoutes = require('./routes/auth');  
app.use('/auth', authRoutes);

const homeRoute = require('./routes/home')
app.use('/', homeRoute)

const postRoutes = require('./routes/post')
app.use('/post', postRoutes)

const adminRoutes = require('./routes/admin');
app.use('/admin', isAuthenticatedAsAdmin, adminRoutes)


app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})
// =======================================
//              DEPENDENCIES
// =======================================
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const port = 3000;
const bcrypt = require('bcrypt');

// middleware
app.use(express.json());
app.use(express.static('public'));

app.use(session({
  secret: 'brandforceforever',
  resave: false,
  saveUninitialized: false
}));

// Users controller
const userController = require('./controllers/users.js');
app.use('/users', userController);

// Sessions controller
const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

//Trip controller
const tripsController = require('./controllers/trips.js')
app.use('/trips.js', tripsController)

// =======================================
//              LISTENER
// =======================================
app.listen(port, () => {
  console.log(`Branch Force App listening on port: ${port}`);
});

// connect to mongoose
mongoose.connect('mongodb://localhost:27017/branchforce', { useNewUrlParser: true});
mongoose.connection.once('open', () => {
  console.log('connected to mongoose...');
});

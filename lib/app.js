const express = require('express');
const app = express();
app.use(express.json());

//Middleware
app.use(express.static('public'));
app.use(express.json());

//Routes
const ensureAuth = require('./util/ensure-auth')();
const auth = require('./routes/auth');
const actors = require('./routes/actors');
const studios = require('./routes/studios');
const reviewers = require('./routes/reviewers');
const films = require('./routes/films');
const reviews = require('./routes/reviews');

app.use('/api/auth', auth);
app.use('/api/reviewers', ensureAuth, reviewers);
app.use('/api/actors', actors);
app.use('/api/studios', studios);
app.use('/api/reviewers', reviewers);
app.use('/api/films', films);
app.use('/api/reviews', reviews);

const { handler, api404 } = require('./util/errors');

app.use('/api', api404);
app.use((req, res) => {
    res.sendStatus(404);
});
app.use(handler);

module.exports = app;
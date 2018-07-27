const express = require('express');
const app = express();
// const morgan = require('morgan');


//Middleware
// app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

//Routes
const ensureAuth = require('./util/ensure-auth')();
const reviewers = require('./routes/reviewers');
const auth = require('./routes/auth');
const actors = require('./routes/actors');
const studios = require('./routes/studios');
const films = require('./routes/films');
const reviews = require('./routes/reviews');

app.use('/api/auth', auth);
app.use('/api/reviewers', ensureAuth, reviewers);
app.use('/api/actors', ensureAuth, actors);
app.use('/api/studios', ensureAuth, studios);
app.use('/api/films', ensureAuth, films);
app.use('/api/reviews', ensureAuth, reviews);

const { handler, api404 } = require('./util/errors');

app.use('/api', api404);
app.use((req, res) => {
    res.sendStatus(404);
});
app.use(handler);

module.exports = app;
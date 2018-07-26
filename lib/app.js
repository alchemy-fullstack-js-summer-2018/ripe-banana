const express = require('express');
const app = express();
// const morgan = require('morgan');

// app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

// routes
const ensureAuth = require('../lib/util/ensure-auth')();

const  studios = require('./routes/studios');
const  actors = require('./routes/actors');
const  reviewers = require('./routes/reviewers');
const films = require('./routes/films');
const reviews = require('./routes/reviews');

app.use('/api/studios', studios);
app.use('/api/actors', actors);
app.use('/api/reviewers', reviewers);
app.use('/api/films', films);
app.use('/api/reviews', reviews);

const { handler, api404 } = require('./util/errors');

app.use('/api', api404);
// general 404
app.use((req, res) => {
    res.sendStatus(404);
});

//eslint=disable-next-line
app.use(handler);

module.exports = app;
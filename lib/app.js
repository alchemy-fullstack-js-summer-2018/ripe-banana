const express = require('express');
const app = express();

app.use(express.json());

const studios = require('./routes/studios');
const actors = require('./routes/actors');
const reviewers = require('./routes/reviewers');
const reviews = require('./routes/reviews');
const films = require('./routes/films');

app.use('/api/studios', studios);
app.use('/api/actors', actors);
app.use('/api/reviewers', reviewers);
app.use('/api/reviews', reviews);
app.use('/api/films', films);
module.exports = app;
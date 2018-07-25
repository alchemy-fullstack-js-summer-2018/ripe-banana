const express = require('express');
const app = express();
// const morgan = require('morgan');

const path = require('path');
const publicDir = path.resolve(__dirname, '../public');
// app.use(morgan('dev'));
app.use(express.static(publicDir));
app.use(express.json());

const { handler, api404 } = require('./utils/errors');

const studios = require('./routes/studios');
app.use('/api/studios', studios);
const reviewers = require('./routes/reviewers');
app.use('/api/reviewers', reviewers);
const actors = require('./routes/actors');
app.use('/api/actors', actors);
const films = require('./routes/films');
app.use('/api/films', films);
const reviews = require('./routes/reviews');
app.use('/api/reviews', reviews);

app.use('/api', api404);
app.use((req, res) => {
    res.sendStatus(404);
});

app.use(handler);

module.exports = app;
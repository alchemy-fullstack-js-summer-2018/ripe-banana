const express = require('express');
const app = express();
const morgan = require('morgan');
const { api404 } = require('./util/errors');

app.use(morgan('dev'));
app.use(express.json());

const actors = require('./routes/actors');
const studios = require('./routes/studios');
const reviewers = require('./routes/reviewers');
const films = require('./routes/films');

app.use('/api/actors', actors);
app.use('/api/studios', studios);
app.use('/api/reviewers', reviewers);
app.use('/api/films', films);

app.use('/api', api404);

app.use((req, res) => {
    res.sendStatus(404);
});

module.exports = app;
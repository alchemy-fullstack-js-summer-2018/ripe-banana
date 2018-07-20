const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());

const actors = require('./routes/actors');
const reviewers = require('./routes/reviewers');

app.use('/api/actors', actors);
app.use('/api/reviewers', reviewers);

const { api404 } = require('./util/errors');

app.use('/api', api404);

app.use((req, res) => {
    res.sendStatus(404);
});

module.exports = app;
const express = require('express');
const app = express();
// const morgan = require('morgan');

const studios = require('./routes/studios');
const actors = require('./routes/actors');
const reviewers = require('./routes/reviewers');

app.use(express.json());


app.use('/api/studios', studios);
app.use('/api/actors', actors);
app.use('/api/reviewers', reviewers);

module.exports = app;
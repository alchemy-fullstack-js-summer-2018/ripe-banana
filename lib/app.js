const express = require('express');
const app = express();
const morgan = require('morgan');
const { api404 } = require('./util/errors');
require('dotenv').config();

app.use(morgan('dev'));
app.use(express.json());

const actors = require('./routes/actors');
const studios = require('./routes/studios');
const auth = require('./routes/auth');
const films = require('./routes/films');
const reviews = require('./routes/reviews');

app.use('/api/actors', actors);
app.use('/api/studios', studios);
app.use('/api/auth', auth);
app.use('/api/films', films);
app.use('/api/reviews', reviews);

app.use('/api', api404);

app.use((req, res) => {
    res.sendStatus(404);
});

module.exports = app;
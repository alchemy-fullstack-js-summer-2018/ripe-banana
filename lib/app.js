const express = require('express');
const app = express();
const morgan = require('morgan');

const studios = require('./routes/studios');

app.use('/api/studios', studios);

module.exports = app;
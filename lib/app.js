const express = require('express');
const app = express();
// const morgan = require('morgan');

const studios = require('./routes/studios');
const actors = require('./routes/actors');

app.use(express.json());


app.use('/api/studios', studios);
app.use('/api/actors', actors);

module.exports = app;
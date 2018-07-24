require('dotenv').config();
const connect = require('../lib/util/connect');
const Reviewer = require('../lib/models/reviewer');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hollywood';
connect(MONGODB_URI);

Reviewer.findByIdAndUpdate(
    '5b57bb7b977148368c3a149e',
    {
        $addToSet: {
            roles: 'admin'
        }
    }
)
    .catch(console.log)
    .then(() => mongoose.connection.close());
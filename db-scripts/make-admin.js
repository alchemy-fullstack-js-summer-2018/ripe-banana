require('dotenv').config();
const connect = require('../lib/util/connect');
const User = require('../model/reviewers');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ripe_banana';
connect(MONGODB_URI);

User.findByIdAndUpdate(
    '5b5ac2e76df9abcab0381963',
    {
        $addToSet: {
            roles: 'admin'
        }
    }
)
    .catch(console.log)
    .then(() => mongoose.connection.close());
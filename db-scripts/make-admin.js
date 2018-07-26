require('dotenv').config();
const connect = require('../lib/utils/connect');
const User = require('../lib/models/user');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/banana';
connect(MONGODB_URI);

User.findByIdAndUpdate(
    '5b58f8391fb3b95258373f17',
    {
        $addToSet: {
            roles: 'admin'
        }
    }
)
    .catch(console.log)
    .then(() => mongoose.connection.close());
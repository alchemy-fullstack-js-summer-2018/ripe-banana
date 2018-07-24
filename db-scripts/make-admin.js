require('dotenv').config();
const connect = require('../util/connect');
const User = require('../lib/models/user');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tours';
connect(MONGODB_URI);

User.findByIdAndUpdate(
    //ENTER USER ID HERE,
    {
        $addToSet: {
            roles:'admin'
        }
    }
)
    .catch(console.log)
    .then(() => mongoose.connection.close());
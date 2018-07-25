require('dotenv').config();
const connect = require('../lib/util/connect');
const User = require('../lib/models/user');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hollywood';
connect(MONGODB_URI);

User.findByIdAndUpdate(
    '5b590129ff3dde92989402bc',
    {
        $addToSet: {
            roles: 'admin'
        }
    }
)
    .catch(console.log)
    .then(() => mongoose.connection.close());
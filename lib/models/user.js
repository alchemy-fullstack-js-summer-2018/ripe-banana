const mongoose = require('mongoose');
const { Schema } = mongoose;
// const bcrypt = require('bcryptjs');

const schema = new Schema({
    email: {
        type: String, 
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    roles: true 
});



module.exports = mongoose.model('User', schema);
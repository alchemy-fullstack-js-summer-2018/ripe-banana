const mongoose = require('mongoose');
const { Schema } = mongoose;
// const brcypt = require('bcryptjs');

const schema = new Schema({
    email: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    roles: [String]
});

module.exports = mongoose.model('Reviewer', schema);
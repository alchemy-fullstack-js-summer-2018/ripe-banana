const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    dob: Date,
    pob: String
});

module.exports = mongoose.model('Actor', schema);
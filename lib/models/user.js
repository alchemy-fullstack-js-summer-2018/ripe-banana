const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const schema = new Schema({
    email: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        ref: 'Reviewer',
        required: true
    },
    roles: [String]
});

schema.methods.generateHash = function(password) {
    this.hash = bcrypt.hashSync(password, 8);
};

schema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash);
};



module.exports = mongoose.model('User', schema);
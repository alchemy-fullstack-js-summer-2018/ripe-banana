const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    rating: {
        type: Number,
        required: true
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    review: {
        type: String,
        maxlength: 140,
        required: true
    },
    film: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Film'
    },
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('Review', schema);
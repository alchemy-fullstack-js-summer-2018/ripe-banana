const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({

    rating: {
        type: Number,
        required: true
    },
    reviewer: {
        type: Schema.Types.ObjectId,
        required: true
    },
    review: {
        type: String,
        maxlength: 140,
        required: true
    },
    film: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: Date,
    updatedAt: Date
});

module.exports = mongoose.model('Review', schema);
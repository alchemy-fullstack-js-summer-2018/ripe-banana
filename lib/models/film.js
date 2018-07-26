const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    studio: {
        type: Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    released: {
        type: Number,
        required: true,
        validate: {
            validator: v => {
                return /\d{4}/.test(v);
            },
            message: 'Must be a valid year'
        }
    },
    cast: [{
        role: String,
        actor: {
            type: Schema.Types.ObjectId,
            ref: 'Actor',
            required: true
        }
    }]
});

module.exports = mongoose.model('Film', schema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    studio: {
        type: Schema.Types.ObjectId,
        required: true
    },
    released: {
        type: Number,
        required: true,
    },
    cast: [{
        role: String,
        actor: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Actor'
        }
    }]
    
});

module.exports = mongoose.model('Film', schema);
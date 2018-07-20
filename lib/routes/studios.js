const router = require('express').Router();
const Studio = require('../models/studio');
// const { HttpError } = require('../util/errors');

// const updateOptions = {
//     new: true,
//     runValidators: true
// };

module.exports = router
    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .then(studios => res.json(studios))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Studio.findById(req.params.id)
            .lean()
            .then(studio => {
                res.json(studio);
            })
            .catch(next); 
    })
    .post('/', (req, res, next) => {
        console.log(req.body);
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    });


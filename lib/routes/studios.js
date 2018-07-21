const router = require('express').Router();
const Studio = require('../models/studio');
const { HttpError } = require('../util/errors');

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No studio with id ${id}`
});

module.exports = router

    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })

    .get('/:id', (req, res , next) => {
        Studio.findById(req.params.id)
            .lean()
            .then(studio => {
                if(!studio) {
                    next(make404(req.params.id));
                } else {
                    res.json(studio);
                }
            })
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Studio.find(req.query) 
            .lean()
            .then(studios => res.json(studios))
            .catch(next); 
    });
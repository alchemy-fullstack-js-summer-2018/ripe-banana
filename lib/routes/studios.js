const router = require('express').Router();
const Studio = require('../models/studio');
const { HttpError } = require('../util/errors');

const make404 = id => new HttpError({
    code: 404,
    message: `No Studio With id ${id}`
});


module.exports = router 
    .get('/', (req, res, next) => {
        Studio.find({})
            .lean()
            .select('name')
            .then(studios => res.json(studios))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Studio.findById(req.params.id)
            .lean()
            .then(studio => {
                if(!studio) {
                    next(make404(req.params.id));
                }
                else {
                    res.json(studio);
                }
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Studio.findByIdAndRemove(req.params.id)
            .then(studio => res.json({ removed: !!studio }))
            .catch(next);
    });
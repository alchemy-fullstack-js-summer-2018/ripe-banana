const router = require('express').Router();
const Studio = require('../models/studio');
const Film = require('../models/film');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth')();
const ensureRole = require('../util/ensure-role')('admin');

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

    .get('/', (req, res, next) => {
        Studio.find(req.query)
            .lean()
            .select('id name')
            .then(studios => res.json(studios))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Studio.findById(req.params.id)
            .lean()
            .select('-__v')
            .then(studio => {
                if(!studio) next(make404(req.params.id));
                else res.json(studio);
            })
            .catch(next);
    })

    .delete('/:id', ensureAuth, ensureRole, (req, res, next) => {
        Promise.all([
            Studio.findById(req.params.id)
                .lean()
                .select('-__v'),
            Film.find({ studio: req.params.id })
                .lean()
        ])
            .then(([studio, films]) => {
                if(films.length > 0) res.json({ removed: false });
                else {
                    Studio.findByIdAndDelete(studio._id)
                        .then(() => {
                            res.json({ removed: true });
                        });
                }
            })
            .catch(next);
    });
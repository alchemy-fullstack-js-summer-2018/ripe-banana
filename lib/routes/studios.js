const router = require('express').Router();
const Studio = require('../models/studio');
const Film = require('../models/film');
const { HttpError } = require('../utils/errors');
const ensureAuth = require('../utils/ensure-auth')();
const ensureAdmin = require('../utils/ensure-role')('admin');

const make404 = id => new HttpError({
    code: 404,
    message: `No studio with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Studio.find({}, 'name')
            .lean()
            .then(studio => res.json(studio))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Studio.findById(req.params.id, '-__v')
                .lean(),
            Film.find({ studio: req.params.id }, 'title')
                .lean()
        ])
            .then(([studio, films]) => {
                if(!studio) {
                    next(make404(req.params.id));
                }
                else {
                    studio.films = films;
                    res.json(studio);
                }
            })
            .catch(next);
    })
    .post('/', ensureAuth, ensureAdmin, (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })
    .delete('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        Film.find({ studio: req.params.id })
            .then(result => {
                if(result.length > 0) res.json({ removed: false });
                else Studio.findByIdAndRemove(req.params.id)
                    .then(studio => res.json({ removed: !!studio }));
            })
            .catch(next);
    });
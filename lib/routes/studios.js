const router = require('express').Router();
const Studio = require('../models/studio');
const Film = require('../models/film');
const { HttpError } = require('../util/errors');

// const updateOptions = {
//     new: true,
//     runValidators: true
// };

const make404 = id => new HttpError({
    code: 404,
    message: `No studio with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .select('name')
            .then(studios => res.json(studios))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Studio.findById(req.params.id)
                .lean(),
            Film
                .find({ studio: req.params.id })
                .lean()
                .select('title')
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
    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        return Film
            .find({ title: req.params.id })
            .then(films => {
                if(films.length) res.json('Cannot delete studio.');
                else {
                    Studio.findByIdAndRemove(req.params.id)
                        .then(studio => res.json({ removed: !!studio }))
                        .catch(next);
                }
            });
    });

  
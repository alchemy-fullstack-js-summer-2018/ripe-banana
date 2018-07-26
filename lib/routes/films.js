const router = require('express').Router();
const Film = require('../models/film');
const Review = require('../models/review');
const { HttpError } = require('../utils/errors');
const ensureAuth = require('../utils/ensure-auth')();
const ensureAdmin = require('../utils/ensure-role')('admin');

const make404 = id => new HttpError({
    code: 404,
    message: `No film with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Film.find({}, '-cast -__v')
            .lean()
            .populate('studio', 'name')
            .then(films => res.json(films))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Film.findById(req.params.id, '-__v')
                .lean()
                .populate('studio', 'name')
                .populate('cast.actor', 'name'),
            Review.find({ film: req.params.id }, 'id rating review reviewer')
                .lean()
                .populate('reviewer', 'name')
        ])
            .then(([film, reviews]) => {
                if(!film) {
                    next(make404(req.params.id));
                }
                else {
                    film.reviews = reviews;
                    res.json(film);
                }
            })
            .catch(next);
    })
    .post('/', ensureAuth, ensureAdmin, (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    })
    .delete('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        Film.findByIdAndRemove(req.params.id)
            .then(film => res.json({ removed: !!film }))
            .catch(next);
    });
    
const router = require('express').Router();
const Film = require('../models/film');
const Review = require('../models/review');
// const { HttpError } = require('../util/errors');

// const make404 = id => new HttpError({
//     code: 404,
//     message: `No actor with id ${id}`
// });

module.exports = router
    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .select('title released studio')
            .populate('studio', 'name')
            .then(films => res.json(films))
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        Promise.all([
            Film.findById(req.params.id)
                .lean()
                .select('-__v')
                .populate('studio', 'name')
                .populate('cast.actor', 'name'),
            Review.find({ film: req.params.id })
                .lean()
                .select('rating review reviewer')
                .populate('reviewer', 'name')
        ])
            .then(([film, reviews]) => {
                film.reviews = reviews;
                res.json(film);
            })
            .catch(next);
    })

    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    });
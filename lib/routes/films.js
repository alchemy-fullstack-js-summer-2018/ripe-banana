const router = require('express').Router();
const Film = require('../models/film');
const Review = require('../models/review');
// const Reviewer = require('../models/reviewer');
const { HttpError } = require('../util/errors');

// const updateOptions = {
//     new: true,
//     runValidators: true
// };

const make404 = id => new HttpError({
    code: 404,
    message: `No film with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .populate({
                path: 'studio',
                select: 'name'
            })
            .select('title released studio')
            .then(films => res.json(films))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        
        Promise.all([
            Film.findById(req.params.id)
                .lean()
                .populate({
                    path: 'studio',
                    select: 'name'
                })
                .populate({
                    path: 'cast.actor',
                    select: 'name'
                }),
            Review.find({ film: req.params.id })
                .lean()
                .populate({
                    path: 'reviewer',
                    select: 'name company'
                })
                .select('rating review reviewer')

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

    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    });


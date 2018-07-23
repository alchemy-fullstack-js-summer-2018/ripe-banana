const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
const { HttpError } = require('../util/errors');

const make404 = id => new HttpError({
    code: 404,
    message: `No reviewer with id ${id}`
});

module.exports = router
    .post('/', (req, res, next) => {
        Reviewer.create(req.body)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })
 

    .get('/:id', (req, res, next) => {
        Promise.all([
            Reviewer.findById(req.params.id)
                .lean()
                .select('-__v'),
            Review.find({ reviewer: req.params.id })
                .lean()
                .select('rating review reviewer film')
                .populate('reviewer', 'name')
                .populate('film', 'title')
        ])
            .then(([reviewer, reviews]) => {
                if(!reviewer) next(make404(req.params.id));
                else {
                    reviewer.reviews = reviews;
                    reviewer.reviews.film = reviews.film;
                    res.json(reviewer);
                }
            })
            .catch(next);


    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .lean()
            .then(reviewers => res.json(reviewers))
            .catch(next);
    })



    .put('/:id', (req, res, next) => {
        Reviewer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ) 
            .then(reviewer => res.json(reviewer))
            .catch(next);
    });
            
   





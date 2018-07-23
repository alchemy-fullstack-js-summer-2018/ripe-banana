const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
const { HttpError } = require('../util/errors');

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No reviewer with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Reviewer.find()
            .lean()
            .then(reviewers => res.json(reviewers))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Reviewer.findById(req.params.id)
                .lean(),
            Review.find({ reviewer: req.params.id })
                .lean()
                .populate({
                    path: 'film',
                    select: 'title'
                })
                .select('rating review film')

        ])
            .then(([reviewer, reviews]) => {
                if(!reviewer) {
                    next(make404(req.params.id));
                }
                else {
                    reviewer.reviews = reviews;
                    res.json(reviewer);
                } 
            })
            .catch(next);

    })
    .post('/', (req, res, next) => {
        Reviewer.create(req.body)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Reviewer.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(reviewer => res.json(reviewer))
            .catch(next);
    });


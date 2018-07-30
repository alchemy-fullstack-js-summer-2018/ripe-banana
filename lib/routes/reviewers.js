const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
const { updateOptions } = require('./_helpers');
const ensureAuth = require('../util/ensure-auth')();
const ensureAdmin = require('../util/ensure-role')('admin');

module.exports = router

    .post('/', ensureAuth, ensureAdmin, (req, res, next) => {
        Reviewer.create(req.body)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .lean()
            .select('name company')
            .then(reviewers => res.json(reviewers))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Promise.all([
            Reviewer.findById(req.params.id)
                .lean()
                .select('name company'),
            Review.find({ reviewer: req.params.id })
                .lean()
                .populate({
                    path: 'film',
                    select: 'title'
                })
                .select('rating review'),
        ])
            .then(([reviewer, reviews]) => {
                if(!reviewer) {
                    console.log('Reviewer not found');
                } else {
                    reviewer.reviews = reviews;
                    res.json(reviewer);
                }
            })
            .catch(next);
    })

    .put('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        Reviewer.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .select('name company')
            .then(reviewer => res.json(reviewer))
            .catch(next);
    });
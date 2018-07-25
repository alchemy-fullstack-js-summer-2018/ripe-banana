const router = require('express').Router();
const Review = require('../models/review');


module.exports = router
    .get('/', (req, res, next) => {
        Review.find({}, 'rating review film')
            .lean()
            .limit(100)
            .populate('film', 'title')
            .then(review => res.json(review))
            .catch(next);
    })
    .post('/', /* ensureAuth, */ (req, res, next) => {
        if(req.body.length > 0) {
            Review.insertMany(req.body)
                .then(reviewers => res.json(reviewers))
                .catch(next);
        }
        else Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    });
const router = require('express').Router();
const Review = require('../models/review');
const ensureAuth = require('../utils/ensure-auth')();


module.exports = router
    .get('/', (req, res, next) => {
        Review.find({}, 'rating review film')
            .lean()
            .limit(100)
            .populate('film', 'title')
            .then(review => res.json(review))
            .catch(next);
    })
    .post('/', ensureAuth, (req, res, next) => {
        req.body.reviewer = req.user.reviewer;
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    });
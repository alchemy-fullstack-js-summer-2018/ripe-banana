const router = require('express').Router();
const Review = require('../models/review');
const ensureAuth = require('../util/ensure-auth')();

module.exports = router

    .post('/', ensureAuth, (req, res, next) => {
        req.body.reviewer = req.reviewer.id;
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Review.find(req.query)
            .populate('reviewer', 'name')
            .populate('film', 'title')
            .sort({ 'date': -1 })
            .limit(100)
            .lean()
            .then(reviews => res.json(reviews))
            .catch(next);
    });

    

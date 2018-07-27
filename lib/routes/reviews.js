const router = require('express').Router();
const Review = require('../models/review');
const ensureAuth = require('../util/ensure-auth')();
const ensureAdmin = require('../util/ensure-role')('admin');

module.exports = router

    .post('/', ensureAuth, ensureAdmin, (req, res, next) => {
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
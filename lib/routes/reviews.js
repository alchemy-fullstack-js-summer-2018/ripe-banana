const router = require('express').Router();
const Review = require('../models/review');
// const { HttpError } = require('../util/errors');

// const make404 = id => new HttpError({
//     code: 404,
//     message: `No studio with id ${id}`
// });

module.exports = router
    .get('/', (req, res, next) => {
        Review.find()
            .lean()
            .select('rating review film')
            .populate('film', 'title')
            .then(reviews => res.json(reviews))
            .catch(next);
    })
    .post('/', (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    });
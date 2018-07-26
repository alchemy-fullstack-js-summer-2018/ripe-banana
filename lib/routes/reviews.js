const router = require('express').Router();
const Review = require('../models/review');
const { HttpError } = require('../util/errors');

const make404 = id => new HttpError({
    code: 404,
    message: `No studio with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Review.find({})
            .lean()
            .limit(100)
            .sort({ createdAt: 'desc' })
            .select('rating review film createdAt')
            .populate('film', 'title')
            .then(reviews => {
                if(!reviews) next(make404(req.params.id));
                else res.json(reviews);
            })
            .catch(next);
    })
    .post('/',  (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    });
const router = require('express').Router();
const Review = require('../models/review');
const ensureAuth = require('../util/ensure-auth');
const { updateOptions } = require('../util/ensure-auth')();

module.exports = router
    .get('/', (req, res, next) => {
        Review.find({})
            .lean()
            .limit(100)
            .populate({
                path: 'film', 
                select: 'title'
            })
            .select('rating review film')
            .then(reviews => res.json(reviews))
            .catch(next);
    })
    
    .post('/', ensureAuth, (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    })

    .put('/:id', ensureAuth, (req, res, next) => {
        Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .select('rating review')
            .then(review => res.json(review))
            .catch(next);
    });


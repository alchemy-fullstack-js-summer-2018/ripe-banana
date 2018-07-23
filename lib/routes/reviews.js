const router = require('express').Router();
const Review = require('../models/review');
const { HttpError } = require('../util/errors');

// const updateOptions = {
//     new: true,
//     runValidators: true
// };

const make404 = id => new HttpError({
    code: 404,
    message: `No review with id ${id}`
});

module.exports = router
    // .get('/', (req, res, next) => {
    //     review.find()
    //         .lean()
    //         .populate({
    //             path: 'studio',
    //             select: 'name'
    //         })
    //         .select('title released studio')
    //         .then(reviews => res.json(reviews))
    //         .catch(next);
    // })
    // .get('/:id', (req, res, next) => {
    //     review.findById(req.params.id)
    //         .lean()
    //         .then(review => {
    //             if(!review) {
    //                 next(make404(req.params.id));
    //             }
    //             else res.json(review);
    //         })
    //         .catch(next); 
    // })
    .post('/', (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    });


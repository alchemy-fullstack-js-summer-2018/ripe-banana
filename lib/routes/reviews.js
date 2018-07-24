const router = require('express').Router();
const Review = require('../models/review');
// const { HttpError } = require('../util/errors');


// const make404 = id => new HttpError({
//     code: 404,
//     message: `No Review With id ${id}`
// });

module.exports = router

    .post('/', (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    });

// .get('/', (req, res, next) => {
//     Review.find()
//         .lean()
//         .select('review')
//         .limit(100)
//         .populate({
//             path: 'film',
//             select: 'title'
//         })
//         .then(reviews => res.json(reviews))
//         .catch(next);
// });

// .get('/:id', (req, res, next) => {

//     Promise.all([
//         Review.findById(req.params.id)
//             .lean(),
//         Reviewer
//             .find({ name: req.params.id })
//             .lean()
//             .select('name')
//     ])
//         .then(([review, reviewers]) => {
//             if(!review) {
//                 next(make404(req.params.id));
//             }
//             else {
//                 review.reviewers = reviewers;
//                 res.json(review);
//             }
//         })
//         .catch(next);
// });


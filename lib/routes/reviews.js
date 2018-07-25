const router = require('express').Router();
const Review = require('../models/review');


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
    
    .post('/', (req, res, next) => {
        Review.create(req.body)
            .then(review => res.json(review))
            .catch(next);
    });


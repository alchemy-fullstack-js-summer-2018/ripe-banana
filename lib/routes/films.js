const router = require('express').Router();
const Film = require('../models/film');
// const { HttpError } = require('../util/errors');

// const make404 = id => new HttpError({
//     code: 404,
//     message: `No actor with id ${id}`
// });

module.exports = router
    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .select('title cast released studio')
            .populate({
                path: 'studio',
                select: 'name'
            })
            .populate({
                path: 'actor',
                select: 'name'
            })
            .then(films => res.json(films))
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .lean()
            .then(film => res.json(film))
            .catch(next);
    })
    
    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    });
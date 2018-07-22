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
            .select('title released studio')
            .populate('studio', 'name')
            .then(films => res.json(films))
            .catch(next);
    })
    
    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .lean()
            .select('title released studio cast') // and reviews!
            .populate('studio', 'name')
            .populate('cast.actor', 'name')
            // TODO: Populate the reviews!
            .then(film => res.json(film))
            .catch(next);
    })
    
    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    });
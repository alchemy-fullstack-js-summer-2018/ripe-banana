const router = require('express').Router();
const Film = require('../models/film');
const { HttpError } = require('../util/errors');

// const updateOptions = {
//     new: true,
//     runValidators: true
// };

const make404 = id => new HttpError({
    code: 404,
    message: `No film with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Film.find()
            .lean()
            .populate({
                path: 'studio',
                select: 'name'
            })
            .select('title released studio')
            .then(films => res.json(films))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Film.findById(req.params.id)
            .lean()
            .then(film => {
                if(!film) {
                    next(make404(req.params.id));
                }
                else res.json(film);
            })
            .catch(next); 
    })
    .post('/', (req, res, next) => {
        Film.create(req.body)
            .then(film => res.json(film))
            .catch(next);
    });


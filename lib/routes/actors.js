const router = require('express').Router();
const Actor = require('../models/actor');
const Film = require('../models/film');
const { HttpError } = require('../util/errors');
const ensureAuth = require('../util/ensure-auth')();
const ensureAdmin = require('../util/ensure-role')('admin');


const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No actor with id ${id}`
});

module.exports = router

    .post('/', ensureAuth, ensureAdmin, (req, res, next) => {
        Actor.create(req.body)
            .then(actor => res.json(actor))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Actor.findById(req.params.id) 
            .lean()
            .then(actor => {
                if(!actor) {
                    next(make404(req.params.id));
                } else {
                    res.json(actor);
                }
            })
            .catch(next);
        
    })

    .get('/', (req, res, next) => {
        Actor.find(req.query) 
            .lean()
            .then(actors => res.json(actors))
            .catch(next); 
    })

    .put('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        Actor.findByIdAndUpdate(
            req.params.id, 
            req.body,
            updateOptions
        )
            .then(actor => res.json(actor))
            .catch(next);
    })

    .delete('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        Film.find({ '.cast.actor': req.params.id })
            .then(films => {
                if(films.length > 0) {
                    res.json({ removed: false });
                } else {
                    Actor.findByIdAndRemove(req.params.id)
                        .then(actor => res.json({ removed: !!actor }));
                }
            })
            .catch(next);
    });
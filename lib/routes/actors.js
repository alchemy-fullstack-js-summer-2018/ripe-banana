const router = require('express').Router();
const Actor = require('../models/actor');
const Film = require('../models/film');
const { HttpError } = require('../util/errors');

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No actor with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Actor.find()
            .lean()
            .then(actors => res.json(actors))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Actor.findById(req.params.id)
                .lean(),
            Film
                .find({ 'cast.actor': req.params.id })
                .select('title released')
                .lean() 
        ])   
            .then(([actor, films]) => {
                if(!actor) {
                    next(make404(req.params.id));
                }

                else {  
                    actor.films = films;
                    res.json(actor);
                }
            })
            .catch(next); 
    })
    .post('/', (req, res, next) => {
        Actor.create(req.body)
            .then(actor => res.json(actor))
            .catch(next);
    })
    .put('/:id', (req, res, next) => {
        Actor.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .then(actor => res.json(actor))
            .catch(next);
    })
    .delete('/:id', (req, res, next) => {
        return Film
            .find({ 'cast.actor': req.params.id })
            .then(films => {
                if(films.length) res.json('Cannot delete actor');
                else {
                    Actor.findByIdAndRemove(req.params.id)
                        .then(actor => res.json({ removed: !!actor }))
                        .catch(next);
                }
            });
    });


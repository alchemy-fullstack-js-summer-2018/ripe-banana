const router = require('express').Router();
const Studio = require('../models/studio');
const Film = require('../models/film');

module.exports = router

    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    })

    .get('/', (req, res, next) => {
        Studio.find()
            .lean()
            .select('name')
            .then(studios => res.json(studios))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {

        Promise.all([
            Studio.findById(req.params.id) 
                .lean()
                .select('name address'),
            Film
                .find({ studio: req.params.id })
                .lean()
                .select('title')
        ])
            .then(([studio, films]) => {
                if(!studio) {
                    console.log('Studio not found');
                } else {
                    studio.films = films;
                    res.json(studio);
                }
            })
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Film
            .find({ studio: req.params.id })
            .lean()
            .then((films) => {
                if(films.length > 0) {
                    res.json({ removed: false });
                } else {
                    Studio.findByIdAndRemove(req.params.id)
                        .then(studio => res.json({ removed: !!studio }));  
                }
            })
            .catch(next);
    });

  
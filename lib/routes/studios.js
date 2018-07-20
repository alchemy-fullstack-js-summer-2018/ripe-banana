const router = require('express').Router();
const Studio = require('../models/studio');
// const { HttpError } = require('../util/errors');

// const make404 = id => new HttpError({
//     code: 404,
//     message: `No studio with id ${id}`
// });

module.exports = router
    .post('/', (req, res, next) => {
        Studio.create(req.body)
            .then(studio => res.json(studio))
            .catch(next);
    });
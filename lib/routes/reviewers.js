const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const { HttpError } = require('../util/errors');
const tokenService = require('../util/token-service');
const ensureAuth = require('../util/ensure-auth')();


// const updateOptions = {
//     new: true,
//     runValidators: true
// };

const make404 = id => new HttpError({ 
    code: 404,
    message: `No reviewer with id ${id}`
});

const getCredentials = body => {
    const { email, password } = body;
    delete body.password;
    return { email, password };
};

module.exports = router

    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    })

    .get('/', (req, res, next) => {
        Reviewer.find()
            .lean()
            .then(reviewers => res.json(reviewers))
            .catch(next);
    })

    .get('/:id', (req, res, next) => {
        Reviewer.findById(req.params.id)
            .lean()
            .then(reviewer => {
                if(!reviewer) {
                    next(make404(req.params.id));
                }
                else {
                    res.json(reviewer);
                }
            })
            .catch(next);
    })

    .delete('/:id', (req, res, next) => {
        Reviewer.findByIdAndRemove(req.params.id)
            .then(reviewer => res.json({ removed: !!reviewer }))
            .catch(next);

    })

    .post('/signup', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);

        Reviewer.findOne({ email })
            .countDocuments()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'Email already in use'
                    });
                }

                const reviewer = new Reviewer(body);
                reviewer.generateHash(password);
                return reviewer.save();
            })

            .then(reviewer => tokenService.sign(reviewer))
            .then(token => res.json({ token }))
            .catch(next);
    })

    .post('/signin', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);

        Reviewer.findOne({ email })
            .then(reviewer => {
                if(!reviewer || !reviewer.comparePassword(password)) {
                    throw new HttpError({
                        code: 401,
                        message: 'Invalid email or password'
                    });
                }
                return tokenService.sign(reviewer);
            })
            .then(token => res.json({ token }))
            .catch(next);
    });
const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
const User = require('../models/user');
const { HttpError } = require('../utils/errors');
const tokenService = require('../utils/token-service');
const ensureAuth = require('../utils/ensure-auth')();
const ensureSelf = require('../utils/ensure-self')();

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
        Reviewer.find({}, '-__v')
            .lean()
            .then(reviewers => res.json(reviewers))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Reviewer.findById(req.params.id, '-__v')
                .lean(),
            Review.find({ reviewer: req.params.id }, 'rating review film')
                .lean()
                .populate('film', 'title')
        ])
            .then(([reviewer, reviews]) => {
                if(!reviewer) {
                    next(make404(req.params.id));
                }
                else {
                    reviewer.reviews = reviews;
                    res.json(reviewer);
                }
            })
            .catch(next);
    })
    .post('/signup', ({ body }, res, next) =>{
        const { email, password } = getCredentials(body);
        const data = {
            name: body.name,
            company: body.company
        };

        let reviewer;
        User.findOne({ email })
            .countDocuments()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'Email already in use'
                    });
                }

                const reviewer = new Reviewer(data);
                return reviewer.save();
            })
            .then(saved => {
                body.reviewer = saved._id;
                reviewer = saved;
                const user = new User(body);
                user.generateHash(password);

                return user.save();
            })
            .then(user => tokenService.sign(user))
            .then(token => res.json({ token, reviewer }))
            .catch(next);
    })
    .post('/signin', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);

        User.findOne({ email })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw new HttpError({
                        code: 401,
                        message: 'Invalid email or password'
                    });
                }
                return tokenService.sign(user);
            })
            .then(token => res.json({ token }))
            .catch(next);
    })
    .put('/:id', ensureAuth, ensureSelf, (req, res, next) => {
        Reviewer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .then(reviewer => res.json(reviewer))
            .catch(next);
    });
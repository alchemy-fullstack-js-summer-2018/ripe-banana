const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const Review = require('../models/review');
const { HttpError } = require('../util/errors');
const tokenService = require('../util/token-service');
const ensureAdmin = require('../util/ensure-role')('admin');
const ensureAuth = require('../util/ensure-auth')();

const getCredentials = body => {
    const { email, password } = body;
    delete body.password;
    return { email, password };
};

const updateOptions = {
    new: true,
    runValidators: true
};

const make404 = id => new HttpError({
    code: 404,
    message: `No reviewer with id ${id}`
});

module.exports = router
    .get('/', (req, res, next) => {
        Reviewer.find()
            .lean()
            .select('name company')
            .then(reviewers => res.json(reviewers))
            .catch(next);
    })
    .get('/:id', (req, res, next) => {
        Promise.all([
            Reviewer.findById(req.params.id)
                .lean()
                .select('name company'),
            Review.find({ reviewer: req.params.id })
                .lean()
                .populate({
                    path: 'film',
                    select: 'title'
                })
                .select('rating review film')

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
    .post('/', ensureAuth, ensureAdmin, (req, res, next) => {
        Reviewer.create(req.body)
            .then(reviewer => res.json(reviewer))
            .catch(next);
    })
    .post('/signup', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);
        let reviewer;
        Reviewer.findOne({ email })
            .countDocuments()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'Email already in use.'
                    });
                }

                const reviewer = new Reviewer(body);
                reviewer.generateHash(password);
                return reviewer.save();
            })
            .then(saved => {
                reviewer = {
                    _id: saved._id,
                    name: saved.name,
                    company: saved.company
                };
                return saved;
            })
            .then(reviewer => tokenService.sign(reviewer))
            .then(token => res.json({ token, reviewer }))
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
    })
    .put('/:id', ensureAuth, ensureAdmin, (req, res, next) => {
        Reviewer.findByIdAndUpdate(
            req.params.id,
            req.body,
            updateOptions
        )
            .select('name company')
            .then(reviewer => {

                if(!reviewer) {
                    next(make404(req.params.id));
                }
                else res.json(reviewer);
            })
            .catch(next);
    });


const router = require('express').Router();
const User = require('../models/user');
const { HttpError } = require('../utils/errors');
const tokenService = require('../utils/token-service');

const getCredentials = body => {
    const { email, password } = body;
    delete body.password;
    return { email, password };
};

module.exports = router
    .post('/signup', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);

        User.findOne({ email })
            .count()
            .then(count => {
                if(count > 0) {
                    throw new HttpError({
                        code: 400,
                        message: 'Email is already registered'
                    });
                }
                const user = new User(body);
                user.generateHash(password);
                return user.save();
            })
            .then(user => tokenService.sign(user))
            .then(token => res.json({ token }))
            .catch(next);
    })

    .post('/signin', ({ body }, res, next) => {
        const { email, password } = getCredentials(body);

        User.findOne({ email })
            .then(user => {
                if(!user || !user.comparePassword(password)) {
                    throw new HttpError({
                        code: 401,
                        message: 'Invalid Email or Password'
                    });
                }

                return tokenService.sign(user);
            })
            .then(token => res.json({ token }))
            .catch(next);
    });
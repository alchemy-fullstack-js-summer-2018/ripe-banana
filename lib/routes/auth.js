const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const { HttpError } = require('../util/errors');
const tokenService = require('../util/token-service');
const ensureAuth = require('../util/ensure-auth')();

const getCredentials = body => {
    const { email, password } = body;
    delete body.password;
    return { email, password };
};

module.exports = router
    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    });


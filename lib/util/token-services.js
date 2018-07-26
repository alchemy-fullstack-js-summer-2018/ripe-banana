const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);
const APP_SECRET = 'change-me-now'; //TODO: env

module.exports = {
    sign(reviewer) {
        const payload = {
            id: reviewer._id,
            roles: reviewer.roles
        };

        return sign(payload, APP_SECRET);
    },
    verify(token) {
        return verify(token, APP_SECRET);
    }
};


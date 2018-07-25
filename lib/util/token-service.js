const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const sign = promisify(jwt.sign);
const verify = promisify(jwt.verify);

module.exports = {
    sign(user) {
        const payload = {
            id: user._id,
            roles: user.roles
        };
        return sign(payload, process.env.APP_SECRET);
    },

    verify(token) {
        return verify(token, process.env.APP_SECRET);
    }
};
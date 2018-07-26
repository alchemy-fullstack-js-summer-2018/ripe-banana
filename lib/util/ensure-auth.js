const tokenService = require('./token-service');
const { HttpError } = require('./errors');

module.exports = function createEnsureAuth() {
    return (req, res, next) => {
        const token = req.get('Authorization');

        tokenService.verify(token)
            .then(payload => {
                req.reviewer = payload;
                req.reviewer.isAdmin = req.reviewer.roles.includes('admin');
                next();
            })
            .catch(() => {
                next(new HttpError({
                    code: 401,
                    message: 'Invalid or missing token'
                }));
            });
    };
};
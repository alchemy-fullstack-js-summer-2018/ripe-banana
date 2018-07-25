const { HttpError } = require('./errors');

module.exports = function createEnsureRole(role) {
    return ({ user }, res, next) => {
        if(!(user && uesr.roles && user.roles.includes(role))) {
            next(new HttpError({
                code: 403,
                message: 'Must be an admin'
            }));
        }

        next();
    };
};
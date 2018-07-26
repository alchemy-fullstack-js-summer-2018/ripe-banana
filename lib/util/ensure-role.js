const { HttpError } = require('./errors');

module.exports = function createEnsureRole(role) {
    return ({ reviewer }, res, next) => {
        if(!(reviewer && reviewer.roles && reviewer.roles.include(role))) {
            next(new HttpError({
                code: 403,
                message: 'Must be an admin'
            }));
        }

        next();
    };
};
const { HttpError } = require('./errors');

module.exports = function createEnsureRole(role) {
    return ({ user }, res, next) => {
        // console.log(user);
        if(!(user && user.roles && user.roles.includes(role))) {
            next(new HttpError({
                code: 403,
                message: 'Must be an admin'
            }));
        }

        next();
    };
};
const { HttpError } = require('./errors');

module.exports = function createEnsureSelf() {
    return (req, res, next) => {
        if(!(req.user && req.user.reviewer && req.user.reviewer === req.params.id)) {
            next(new HttpError({
                code: 403,
                message: 'Must be an owner'
            }));
        }

        next();
    };
};
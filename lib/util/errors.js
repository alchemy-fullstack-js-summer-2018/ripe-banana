/* eslint no-console: off*/

const handler = (err, req, res) => {
    let code = 500;
    let error = 'Internal Service Error';

    if(err instanceof HttpError) {
        code = err.code;
        error = err.message;
        console.log('own error', err.name);
    }
    else if(err.name === 'CastError' || err.name === 'ValidationError') {
        code = 400;
        error = err.message; 
    }
    else if(process.env.NODE_ENV !== 'production') {
        error = err.message;
        console.log(err);
    }
    else {
        console.log(err);
    }

    res.status(code).send({ error });
};

const api404 = (req, res, next) => {
    next(new HttpError)({
        code: 404,
        message: 'Api path does not exist'
    });
};

class HttpError extends Error {
    constructor({ code, message }) {
        super(message);
        this.code = code;
        this.name = 'HttpError';
    }
}

module.exports = {
    handler,
    api404,
    HttpError
};
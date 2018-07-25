const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

const user = {
    email: 'jchang@variety.com',
    password: 'iLurvMoviez'
};

let token;

describe.only('Auth API', () => {
    beforeEach(() => dropCollection('users'));

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(user)
            .then(checkOk)
            .then(({ body }) => token = body.token);
    });

    it('signs up a user', () => {
        assert.isDefined(token);
    });
});
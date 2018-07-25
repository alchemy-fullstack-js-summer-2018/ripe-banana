const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

const user = {
    email: 'bobby@variety.com',
    password: 'iLurvMoviez'
};


describe.only('Auth API', () => {
    let token;
    beforeEach(() => dropCollection('users'));

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(user)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signs up a user', () => {
        assert.isDefined(token);
    });
});
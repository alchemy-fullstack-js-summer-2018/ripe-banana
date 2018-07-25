const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

const justin = {
    email: 'jchang@variety.com',
    password: 'iLurvMoviez'
};

const badJustin = {
    email: 'jchang@variety.com',
    password: 'ilikemoviez'
};


describe.only('Auth API', () => {
    let token;
    beforeEach(() => dropCollection('users'));

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(justin)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signs up a user', () => {
        assert.isDefined(token);
    });

    it('verifies a token', () => {
        return request
            .get('/api/auth/verify')
            .set('Authorization', token)
            .then(checkOk);
    });

    it('can sign in a user', () => {
        return request
            .post('/api/auth/signin')
            .send(justin)
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    it('fails on wrong password', () => {
        return request
            .post('/api/auth/signin')
            .send(badJustin)
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });
});
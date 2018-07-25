const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk } = request;

describe('Auth API', () => {
    beforeEach(() => dropDatabase('users'));

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'me@me.com',
                password: 'abc'
            })
            .then(checkOk)
            .then(({ body }) => token = body.token);
    });


    it('signs up a user', () => {
        assert.isDefined(token);
    });
    
    it('can sign in a user', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'me@me.com',
                password: 'abc'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    it('fails on wrong password', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'me@me.com',
                password: 'bad'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid Email or Password');
            });
    });

    it('cannot signup with same email', () => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'me@me.com',
                password: 'bad'
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email is already registered');
            });
    });
});
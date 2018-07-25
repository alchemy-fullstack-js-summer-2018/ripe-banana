const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe.only('Auth API', () => {

    beforeEach(() => dropCollection('users'));

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'me@me.com',
                password: '123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('Signs up a user', () => {
        assert.isDefined(token);
    });
    
    it.skip('Verifies a token', () => {
        return request
            .get('/api/auth/verify')
            .set('Authorization', token)
            .then(checkOk);
    });

    it('Can sign in a user', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'me@me.com',
                password: '123'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    it('Fails on wrong pasword', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'me@me.com',
                password: 'bad'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });

    it('Cannot sign up with same email', () => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'me@me.com',
                password: '123'
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email already in use');
            });
    });

    it('Gives 401 on bad email signin', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'bad@me.com',
                password: '123'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });

});
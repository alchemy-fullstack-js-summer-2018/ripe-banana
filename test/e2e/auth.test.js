const { assert } = require('chai');
const  request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe('Auth API', () => {

    beforeEach(() => dropCollection('reviewers'));

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Justin Chang',
                company: 'The Hollywood Reporter',
                email: 'justin@email.com',
                password: 'pwd123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signs up a reviewer', () => {
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
            .send({
                email: 'justin@email.com',
                password: 'pwd123'
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
                email: 'justin@email.com',
                password: 'bad'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });

    it('cannot signup with same email', () => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'justin@email.com',
                password: 'pwd123'

            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email already in use');
            });
    });

    it('Give 401 on bad email signin', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'notjustin@email.com',
                password: 'pwd123'
            });
    });
});
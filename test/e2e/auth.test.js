const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe('Auth API', () => {

    beforeEach(() => dropCollection('reviewers'));

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Chip Ellsworth III',
                company: 'Fermented Banana',
                email: 'chip@fermentedbanana.com',
                password: 'pw123'
            })
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

    it('signs in a user', () => {
        return request 
            .post('/api/auth/signin')
            .send({
                name: 'Chip Ellsworth III',
                company: 'Fermented Banana',
                email: 'chip@fermentedbanana.com',
                password: 'pw123'
            })
            .then(checkOk)
            .then(({ body }) => {
                console.log('body***', body);
                assert.isDefined(body.token);
            });
    });

    it.skip('fails on wrong password', () => {
        return request
            .post('/api/auth/signin')
            .send({
                name: 'Chip Ellsworth III',
                company: 'Fermented Banana',
                email: 'chip@fermentedbanana.com',
                password: 'bad'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email and/or password');
            });
    });

    it.skip('cannot signup with same email', () => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Chip Ellsworth III',
                company: 'Fermented Banana',
                email: 'chip@fermentedbanana.com',
                password: 'pw123'
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email already in use');
            });        
    });
});
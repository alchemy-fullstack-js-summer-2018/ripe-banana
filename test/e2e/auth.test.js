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
    
    it('Verifies a token', () => {
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

});
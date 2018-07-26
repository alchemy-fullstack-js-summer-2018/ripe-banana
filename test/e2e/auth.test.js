const { assert } = require('chai');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');


describe('Auth API', () => {

    beforeEach(() => dropCollection('users'));

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({ 
                email: 'bobby@email.com',
                password: 'bobby'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signs up the user', () => {
        assert.isDefined(token);
    });

    it('verifies a token', () => {
        return request
            .get('/api/auth/verify')
            .set('Authorization', token)
            .then(checkOk);
    });

    it('can signin a user', () => {
        return request
            .post('/api/auth/signin')
            .send({
                email: 'bobby@email.com',
                password:'bobby'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });
});

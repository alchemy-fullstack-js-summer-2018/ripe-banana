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
                email: 'crock@email.com',
                password: 'abc12345'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signs up reviewer', () => {
        assert.isDefined(token);
    });

    it('can sign in a reviewer', () => {
        return request
            .post('/api/reviewers/signin')
            .send({
                email: 'crock@email.com',
                password: 'abc12345'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });
});
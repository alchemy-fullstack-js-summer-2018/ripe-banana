const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe('Reviewers API', () => {

    beforeEach(() => dropCollection('reviewers'));

    let token;
    beforeEach(() => {
        return signup(
            {
                name: 'Betty Crocker',
                email: 'crock@email.com',
                company: 'Pancake Hut',
                password: 'abc12345',
                roles: ['admin']
            })
        
            .then(body => {
                token = body.token;
            });
        
    });
    function signup(reviewer) {
        return request
            .post('/api/reviewers/signup')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }

    
    it('signs up and saves a reviewer', () => {
        assert.isOk(token);
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
    
    it('checks token', () => {
        return request
            .get('/api/reviewers/verify')
            .set('Authorization', token)
            .then(checkOk);
    });
});
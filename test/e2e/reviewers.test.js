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

    let crocker;
    // beforeEach(() => {
    //     return save({ 
    //         name: 'Betty Crocker',
    //         email: 'crock@email.com',
    //         company: 'Pancake Hut',
    //         password: 'abc12345',
    //         roles: ['admin']
    //     })
    //         .then(data => {
    //             crocker = data;
    //         });
    // });

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

    it.skip('gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${crocker._id}`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, crocker);
            });
    });

    it.skip('gets a list of reviewers', () => {
        let evans;
        return save({ 
            name: 'Pat Evans',
            email: 'evans@email.com',
            company: 'Pancake Hut',
            password: '123',
            roles: ['admin']
        })
            .then(_evans => {
                evans = _evans;
                return request
                    .get('/api/reviewers')
                    .set('Authorization', token);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [crocker, evans]);
            });
    });

    // it('deletes a reviewer', () => {
    //     return request
    //         .delete(`/api/reviewers/${crocker._id}`)
    //         .then(checkOk)
    //         .then(res => {
    //             assert.deepEqual(res.body, { removed: true });
    //             return request.get('/api/reviewers');
    //         })
    //         .then(checkOk)
    //         .then(({ body }) => {
    //             assert.deepEqual(body, []);
    //         });
    // });
});
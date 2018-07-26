const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe('Reviewers API', () => {

    beforeEach(() => dropCollection('reviewers'));

    let token;
    let crocker;
    beforeEach(() => {
        return request
            //.post('/api/auth/signup')
            .post('/api/reviewers/signup')
            .send({
                name: 'Betty Crocker',
                email: 'crock@email.com',
                company: 'Pancake Hut',
                password: 'abc12345',
                roles: ['admin']
            })
            .then(checkOk)
            .then(({ body })=> {
                token = body.token;
            });
        
    });
    function save(reviewer) {
        return request
            .post('/api/reviewers')
            .set('Authorization', token)
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }

    //let crocker;
    beforeEach(() => {
        return save({ 
            name: 'Betty Crocker',
            email: 'crock@email.com',
            company: 'Pancake Hut',
            roles: ['admin']
        })
            .then(data => {
                crocker = data;
            });
    });

    it('saves a reviewer', () => {
        assert.isOk(crocker._id);
    });
    
    it('gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${crocker._id}`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, crocker);
            });
    });

    it('gets a list of reviewers', () => {
        let evans;
        return save({ 
            name: 'Pat Evans',
            email: 'evans@email.com',
            company: 'Pancake Hut',
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
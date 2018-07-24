const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe('Reviewers API', () => {

    beforeEach(() => dropCollection('reviewers'));

    function save(reviewer) {
        return request
            .post('/api/reviewers')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let crocker;
    beforeEach(() => {
        return save({ 
            name: 'Betty Crocker', 
            company: 'Pancake Hut'
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
            .then(({ body }) => {
                assert.deepEqual(body, crocker);
            });
    });

    it('gets a list of reviewers', () => {
        let evans;
        return save({ 
            name: 'Pat Evans',
            company: 'Horse Farm' 
        })
            .then(_evans => {
                evans = _evans;
                return request.get('/api/reviewers');
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
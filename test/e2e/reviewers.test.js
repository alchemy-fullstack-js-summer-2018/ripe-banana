const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Reviewer API', () => {

    beforeEach(() => dropCollection('reviewers'));

    function save(reviewer) {
        return request
            .post('/api/reviewers')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let reviewer;

    beforeEach(() => {
        return save({
            name: 'Bobby',
            company: 'Unemployed'
        })
            .then(data => {
                reviewer = data;
            });
    });

    it('saves a reviewer', () => {
        assert.isOk(reviewer._id);
    });

    it('gets all reviewers', () => {
        let carrie;
        return save({ 
            name: 'carrie',
            company: 'Student'
        })
            .then(_carrie => {
                carrie = _carrie;
                return request.get('/api/reviewers');  
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [reviewer, carrie]);
            });
    });

    it.skip('updates a reviewer', () => {
        reviewer.name = 'Robert';
        return request 
            .put(`/api/reviewers/${reviewer._id}`)
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, reviewer);
            });
    });

    it('gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${reviewer._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, reviewer);
            });
    });
});
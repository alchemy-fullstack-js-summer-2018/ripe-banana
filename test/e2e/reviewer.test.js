const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Reviewer API', () => {

    beforeEach(() => dropCollection('reviewers'));
   
    let token;
    let tyrone;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Tyrone Payton',
                company: 'Fermented Banana',

                email: 'tyrone@banana.com',
                password: 'abc123',
                roles: ['admin']
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                tyrone = body.reviewer;
            });
    });

    it('signs up a user', () => {
        assert.isDefined(token);
    });

    it('saves a reviewer', () => {
        assert.isOk(tyrone._id);
    });

    it('gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${tyrone._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, tyrone);
            });
    });

    it('gets all reviewers', () => {
        return request
            .get('/api/reviewers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [tyrone]);
            });
    });

    it('updates a reviewer', () => {
        tyrone.company = 'Very Bad Wizards';
        return request
            .put(`/api/reviewers/${tyrone._id}`)
            .set('Authorization', token)
            .send(tyrone)
            .then(checkOk)
            .then(() => {
                assert.equal(tyrone.company, 'Very Bad Wizards');
            });
    });
});
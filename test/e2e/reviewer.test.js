const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe('Reviewer API', () => {
    
    beforeEach(() => dropCollection('reviewers'));
    
    let tyrone;
    let chip;
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
                chip = body.reviewer;
            }); 
    });

    it('it signs up a reviewer', () => {
        assert.isDefined(token);
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
                assert.isDefined(body.token);
            });
    });

    it('verifies a token', () => {
        return request
            .get('/api/auth/verify')
            .set('Authorization', token)
            .then(checkOk);
    });

    it('gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${chip._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, chip);
            });
    });

    it('gets all reviewers', () => {
        return request
            .get('/api/reviewers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [chip]);
            });
    });

    it('updates a reviewer', () => {
        chip.company = 'Very Bad Wizards';
        return request
            .put(`/api/reviewers/${chip._id}`)
            .send(tyrone)
            .then(checkOk)
            .then(() => {
                assert.equal(chip.company, 'Very Bad Wizards');
            });
    });
});
const { assert } = require('chai');
const request = require('./request');
const { dropCollection  } = require('./db');

const { checkOk } = request;

describe('Studios API', () => {

    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('reviewers'));

    let token;
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
            });
    });


    function save(studio) {
        return request
            .post('/api/studios')
            .set('Authorization', token)
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let universal;
    let paramount;

    beforeEach(() => {
        return save({
            name: 'Universal',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            }
        })
            .then(data => {
                universal = data;
            });
    });

    beforeEach(() => {
        return save({
            name: 'Paramount',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            }
        })
            .then(data => {
                paramount = data;
            });
    });
    
    it('saves a studio', () => {
        assert.isOk(universal._id);
    });
    
    it('gets a studio by id', () => {
        return request
            .get(`/api/studios/${universal._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, universal);
            });
    });

    it('get all studios', () => {
        return request
            .get('/api/studios')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [universal, paramount]);
            });
    });

    it('deletes a studio', () => {
        return request
            .delete(`/api/studios/${universal._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/studios');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.length, 1);
            });
    });
});
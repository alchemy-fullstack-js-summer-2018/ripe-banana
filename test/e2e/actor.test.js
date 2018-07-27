const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Actors API', () => {

    beforeEach(() => dropCollection('actors'));
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

    function save(actor) {
        return request
            .post('/api/actors')
            .set('Authorization', token)
            .send(actor)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let winonaRyder;
    let donJohnson;

    beforeEach(() => {
        return save({
            name: 'Winona Ryder',
            dob: new Date(1971, 9, 29),
            pob: 'MN'
        })
            .then(data => {
                winonaRyder = data;
            });
    });

    beforeEach(() => {
        return save({
            name:'Don Johnson',
            dob: new Date(1949, 11, 15),
            pob: 'MO'
        })
            .then(data => {
                donJohnson = data;
            });
    });

    it('saves an actor', () => {
        assert.isOk(winonaRyder._id);
    });

    it('gets an actor by id', () => {
        return request
            .get(`/api/actors/${winonaRyder._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, winonaRyder);
            });
    });

    it('get all actors', () => {
        return request  
            .get('/api/actors')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [winonaRyder, donJohnson]);
            });
    });

    it('updates an actor', () => {
        winonaRyder.pob = 'kleptoland';
        return request
            .put(`/api/actors/${winonaRyder._id}`)
            .set('Authorization', token)
            .send(winonaRyder)
            .then(checkOk)
            .then(() => {
                assert.equal(winonaRyder.pob, 'kleptoland');
            });
    });

    it('deletes an actor', () => {
        return request
            .delete(`/api/actors/${donJohnson._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/actors');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.length, 1);
            });
    });
});
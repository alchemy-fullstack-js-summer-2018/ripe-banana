const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe('Actors API', () => {

    beforeEach(() => dropCollection('actors'));

    function save(actor) {
        return request
            .post('/api/actors')
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
            .send(winonaRyder)
            .then(checkOk)
            .then(() => {
                assert.equal(winonaRyder.pob, 'kleptoland');
            });
    });
});
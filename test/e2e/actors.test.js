const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected http 200 status code');
    return res;
};

describe('Actors API', () => {

    beforeEach(() => dropCollection('actors'));

    function save(actor) {
        return request
            .post('/api/actors')
            .send(actor)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let actor;

    beforeEach(() => {
        return save({ 
            name:'Ryan Gosling',
            dob: new Date(),
            pob: 'Portland, OR'
        })
            .then(data => {
                actor = data;
            });
    });

    it('saves an actor to the database', () => {
        assert.isOk(actor._id);
    });
});
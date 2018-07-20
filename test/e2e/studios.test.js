const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
//const { checkOk } = request;

describe('Studio API', () => {

    beforeEach(() => dropCollection('studios'));

    function save(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            //.then(checkOk)
            .then(({ body }) => body);
    }

    let studio;

    beforeEach(() => {
        return save({
            name: 'The Kick Ass Studio',
            address: {
                city: 'Portland',
                state: 'Oregon',
                country: 'USA'
            }
        })
            .then(data => {
                studio = data;
            });
    });

    it('saves a studio', () => {
        assert.isOk(studio._id);
    });
});
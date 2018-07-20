const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected http 200 status code');
    return res;
};

describe('Studios API', () => {
    beforeEach(() => dropCollection('studios'));

    function save(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let studio;

    beforeEach(() => {
        return save({
            name: 'Warner Bros',
            address: {
                city: 'Bankbur',
                state: 'CA',
                country: 'United States'
            }
        })
            .then(data => studio = data);
    });

    it('saves a studio to the database', () => {
        assert.isOk(studio._id);
    });

    it('gets all studios', () => {
        let netflix;
        return save({
            name: 'Netflix',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'United States'
            }
        })
            .then(data => netflix = data)
            .then(({ body }) => {
                assert.deepEqual(body, [studio, netflix]);
            });
    });
});
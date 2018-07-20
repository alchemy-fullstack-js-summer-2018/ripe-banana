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

    const makeSimple = (studio) => {
        const simple = {
            _id: studio._id,
            name: studio.name
        };
        return simple;
    };

    let warner;

    beforeEach(() => {
        return save({
            name: 'Warner Bros',
            address: {
                city: 'Bankbur',
                state: 'CA',
                country: 'United States'
            }
        })
            .then(data => warner = data);
    });

    it('saves a studio to the database', () => {
        assert.isOk(warner._id);
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
            .then(data => {
                netflix = data;
                return request.get('/api/studios');
            })
            .then(({ body }) => {
                assert.deepEqual(body, [
                    makeSimple(warner),
                    makeSimple(netflix)
                ]);
            });
    });

    it('gets a studio by ID', () => {
        return request
            .get(`/api/studios/${warner._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, warner);
            });
    });
});
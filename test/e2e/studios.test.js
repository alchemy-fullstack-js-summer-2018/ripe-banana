const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected http 200 status code');
    return res;
};

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

const makeWithoutVersion = (studio) => {
    const noVersion = {
        _id: studio._id,
        name: studio.name,
        address: studio.address
    };
    return noVersion;
};

let warnerStudios;
let netflixStudios;

const warner = {
    name: 'Warner Bros',
    address: {
        city: 'Bankbur',
        state: 'CA',
        country: 'United States'
    }
};

const netflix = {
    name: 'Netflix',
    address: {
        city: 'Los Angeles',
        state: 'CA',
        country: 'United States'
    }
};

describe('Studios API', () => {

    beforeEach(() => dropCollection('studios'));

    beforeEach(() => {
        return save(warner)
            .then(data => warnerStudios = data);
    });

    beforeEach(() => {
        return save(netflix)
            .then(data => netflixStudios = data);
    });

    it('saves a studio to the database', () => {
        assert.isOk(warnerStudios._id);
        assert.isOk(netflixStudios._id);
    });

    it('gets all studios', () => {
        return request
            .get('/api/studios')
            .then(({ body }) => {
                assert.deepEqual(body, [
                    makeSimple(warnerStudios),
                    makeSimple(netflixStudios)
                ]);
            });
    });

    it('gets a studio by ID', () => {
        return request
            .get(`/api/studios/${warnerStudios._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, makeWithoutVersion(warnerStudios));
            });
    });
});
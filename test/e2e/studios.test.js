const { assert } = require('chai');
const { request, save, checkOk } = require('./request');
const { dropCollection } = require('./db');
const { verify } = require('../../lib/util/token-service');

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

let token;
let leoActor;
let warnerStudios;
let netflixStudios;

let injoong = {
    email: 'injoong@email.com',
    password: '1234',
    roles: ['admin']
};
const leo = {
    name: 'Leonardo Dicaprio',
    dob: new Date('1972-01-01'),
    pob: 'Los Angeles'
};

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
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('users'));

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(injoong)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                verify(token)
                    .then((body) => {
                        injoong._id = body.id;
                    });
            });
    });

    beforeEach(() => {
        return save('studios', warner, token)
            .then(data => warnerStudios = data);
    });

    beforeEach(() => {
        return save('studios', netflix, token)
            .then(data => netflixStudios = data);
    });

    beforeEach(() => {
        return request
            .post('/api/actors')
            .set('Authorization', token)
            .send(leo)
            .then(checkOk)
            .then(({ body }) => {
                leoActor = body;
            });
    });

    beforeEach(() => {
        return request
            .post('/api/films')
            .send({
                title: 'The Lion King',
                studio: warnerStudios._id,
                released: 1992,
                cast: [
                    {
                        role: 'Simba',
                        actor: leoActor._id
                    }
                ]

            });
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

    it('deletes a studio (but not if its on a film)', () => {
        return request
            .delete(`/api/studios/${warnerStudios._id}`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: false });
            });
    });
    it('deletes a studio if there are no associated films', () => {
        return request
            .delete(`/api/studios/${netflixStudios._id}`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
            });
    });
});
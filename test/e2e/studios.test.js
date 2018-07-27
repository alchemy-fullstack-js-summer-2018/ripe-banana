const { assert } = require('chai');
const { save, checkOk } = require('./request');
const request = require('./request');
const { dropCollection } = require('./db');


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




let leoActor;
let warnerStudios;
let netflixStudios;

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

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Justin Chang',
                company: 'The Hollywood Reporter',
                email: 'justin@email.com',
                password: 'pwd123',
                roles: ['admin']
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('actors'));
    beforeEach(() => dropCollection('reviews'));

    beforeEach(() => {
        return save('studios', token, warner)
            .then(data => warnerStudios = data);
    });

    beforeEach(() => {
        return save('studios', token, netflix)
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
            .set('Authorization', token)
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
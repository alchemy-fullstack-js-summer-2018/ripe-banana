const { assert } = require('chai');
const { request, save, checkOk } = require('./request');
const { dropCollection } = require('./db');
const { verify } = require('../../lib/util/token-service');

const makeSimple = (actor, films) => {
    const simple = {
        _id: actor._id,
        name: actor.name,
        dob: actor.dob,
        pob: actor.pob
    };

    if(films) {
        simple.films = [];
        simple.films[0] = {
            _id: films._id,
            title: films.title,
            released: films.released
        };
    }

    return simple;
};

let inceptionFilm;
let legendaryStudio;
let kenActor;
let ellenActor;
let token;

const legendary = {
    name: 'Legendary',
    address: {
        city: 'Santa Monica',
        state: 'CA',
        country: 'United States'
    }
};

const ken = { 
    name:'Ken Watanabe',
    dob: new Date('1920-11-12'),
    pob: 'Beaverton, OR'
};

const ellen = {
    name: 'Ellen Page',
    dob: new Date('1985-01-21'),
    pob: 'Gresham, OR'
};

let bobby = {
    email: 'bobby@bobby.com',
    password: 'iambobby',
    roles: ['admin']
};

describe.only('Actors API', () => {

    beforeEach(() => dropCollection('actors'));
    beforeEach(() => dropCollection('users'));

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(bobby)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                verify(token)
                    .then(body => bobby._id = body.id);
            });
    });

    beforeEach(() => {
        return request
            .post('/api/studios')
            .send(legendary)
            .then(checkOk)
            .then(({ body }) => legendaryStudio = body);
    });

    beforeEach(() => {
        return save('actors', ken)
            .then(data => kenActor = data);
    });

    beforeEach(() => {
        return save('actors', ellen)
            .then(data => ellenActor = data);
    });

    beforeEach(() => {
        return request
            .post('/api/films')
            .send({
                title: 'Inception',
                studio: legendaryStudio._id,
                released: 2010,
                cast: [{
                    role: 'Saito',
                    actor: kenActor._id
                }]
            })
            .then(checkOk)
            .then(({ body }) => inceptionFilm = body);
    });

    it('saves an actor to the database', () => {
        assert.isOk(kenActor._id);
    });

    it('gets all actors from the db', () => {
        return request
            .get('/api/actors')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [kenActor, ellenActor]);
            });
    });

    it('gets one actor by specific id', () => {
        return request
            .get(`/api/actors/${kenActor._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, makeSimple(kenActor, inceptionFilm));
            });
    });

    it('updates an actor when given their id', () => {
        kenActor.pob = 'Boston, MA';
        return request
            .put(`/api/actors/${kenActor._id}`)
            .set('Authorization', token)
            .send(kenActor)
            .then((({ body }) => {
                assert.deepEqual(body, kenActor);
            }));
    });

    it('removes an actor by ID', () => {
        return request
            .delete(`/api/actors/${ellenActor._id}`)
            .then(checkOk)
            .then(() => {
                return request.get('/api/actors');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [kenActor]);
            });
    });

    it('doesn\'t remove an actor when they are in a film', () => {
        return request
            .get(`/api/actors/${kenActor._id}`)
            .then(checkOk)
            .then(() => {
                return request.delete(`/api/actors/${kenActor._id}`);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: false });
            });
    });
});
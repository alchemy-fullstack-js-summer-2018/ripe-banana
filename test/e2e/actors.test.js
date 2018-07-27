const { assert } = require('chai');
const  request  = require('./request');
const { save, checkOk }  = request;
const { dropCollection } = require('./db');

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

let legendary = {
    name: 'Legendary',
    address: {
        city: 'Santa Monica',
        state: 'CA',
        country: 'United States'
    }
};

let ken = { 
    name:'Ken Watanabe',
    dob: new Date('1920-11-12'),
    pob: 'Beaverton, OR'
};

let ellen = {
    name: 'Ellen Page',
    dob: new Date('1985-01-21'),
    pob: 'Gresham, OR'
};

describe.only('Actors API', () => {

    beforeEach(() => dropCollection('actors'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('reviewers'));

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

    beforeEach(() => {
        return request
            .post('/api/studios')
            .send(legendary)
            .then(checkOk)
            .then(({ body }) => legendary = body);
    });

    beforeEach(() => {
        return save('actors', token, ken)
            .then(data => ken = data);
    });

    beforeEach(() => {
        return save('actors', token, ellen)
            .then(data => ellen = data);
    });

    beforeEach(() => {
        return request
            .post('/api/films')
            .set('Authorization', token) 
            .send({
                title: 'Inception',
                studio: legendary._id,
                released: 2010,
                cast: [{
                    role: 'Saito',
                    actor: ken._id
                }]
            })
            .then(checkOk)
            .then(({ body }) => inceptionFilm = body);
    });

    it('saves an actor to the database', () => {
        assert.isOk(ken._id);
    });

    it('gets all actors from the db', () => {
        return request
            .get('/api/actors')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [ken, ellen]);
            });
    });

    it('gets one actor by specific id', () => {
        return request
            .get(`/api/actors/${ken._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, makeSimple(ken, inceptionFilm));
            });
    });

    it('updates an actor when given their id', () => {
        ken.pob = 'Boston, MA';
        return request
            .put(`/api/actors/${ken._id}`)
            .set('Authorization', token)
            .send(ken)
            .then((({ body }) => {
                assert.deepEqual(body, ken);
            }));
    });

    it('removes an actor by ID', () => {
        return request
            .delete(`/api/actors/${ellen._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(() => {
                return request.get('/api/actors');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [ken]);
            });
    });

    it('doesn\'t remove an actor when they are in a film', () => {
        return request
            .get(`/api/actors/${ken._id}`)
            .then(checkOk)
            .then(() => {
                return request
                    .delete(`/api/actors/${ken._id}`)
                    .set('Authorization', token);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: false });
            });
    });
});
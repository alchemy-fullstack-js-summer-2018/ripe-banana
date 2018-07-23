const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected http 200 status code');
    return res;
};

function save(actor) {
    return request
        .post('/api/actors')
        .send(actor)
        .then(checkOk)
        .then(({ body }) => body);
}

function saveFilm(film) {
    return request
        .post('/api/films')
        .send(film)
        .then(checkOk)
        .then(({ body }) => body);
}

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

describe('Actors API', () => {

    beforeEach(() => dropCollection('actors'));

    beforeEach(() => {
        return request
            .post('/api/studios')
            .send(legendary)
            .then(checkOk)
            .then(({ body }) => legendaryStudio = body);
    });

    beforeEach(() => {
        return save(ken)
            .then(data => kenActor = data);
    });

    beforeEach(() => {
        return save(ellen)
            .then(data => ellenActor = data);
    });

    beforeEach(() => {
        return saveFilm({
            title: 'Inception',
            studio: legendaryStudio._id,
            released: 2010,
            cast: [{
                role: 'Saito',
                actor: kenActor._id
            }]
        })
            .then(data => inceptionFilm = data);
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
            .send(kenActor)
            .then((({ body }) => {
                assert.deepEqual(body, kenActor);
            }));
    });
});
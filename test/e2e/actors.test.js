const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

function save(actor) {
    return request
        .post('/api/actors')
        .send(actor)
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

let chuckNorris;
let billMurray;
let WalkerTexasRanger;
let KickPunchStudio;

const KickPunch = {
    name: 'Kick Punch Studio',
    address: {
        city: 'LA',
        state: 'CA',
        country: 'USA'
    }
};

const chuck = {
    name: 'Chuck Norris',
    dob: new Date('1953-07-04'),
    pob: 'Kyle, OK'
};

const bill = {
    name: 'Bill Murray',
    dob: new Date('1963-09-20'),
    pob: 'Boston, MA'
};

describe('Actors API', () => {

    beforeEach(() => dropCollection('actors'));

    beforeEach(() => {
        return request
            .post('/api/studios')
            .send(KickPunch)
            .then(checkOk)
            .then(({ body }) => KickPunchStudio = body);
    });

    beforeEach(() => {
        return save(bill)
            .then(data => billMurray = data);
    });

    beforeEach(() => {
        return save(chuck)
            .then(data => chuckNorris = data);
    });

    beforeEach(() => {
        return request  
            .post('/api/films')
            .send({
                title: 'Walker Texas Ranger',
                studio: KickPunchStudio._id,
                released: 1999,
                cast: [{
                    role: 'Badass',
                    actor: chuckNorris._id
                }]
            })
            .then(checkOk)
            .then(({ body })=> WalkerTexasRanger = body);
    });

    it('saves an Actor', () => {
        assert.isOk(chuckNorris._id);
    });

    it('gets an actor by id', () => {
        return request
            .get(`/api/actors/${chuckNorris._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, makeSimple(chuckNorris, WalkerTexasRanger));
            });
    });

    it('gets a list of actors', () => {
        return request
            .get('/api/actors')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [billMurray, chuckNorris]);
            });
    });

    it('deletes an actor', () => {
        return request  
            .delete(`/api/actors/${chuckNorris._id}`)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/actors');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [billMurray]);
            });
    });
});
const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

function save(film) {
    return request
        .post('/api/films')
        .send(film)
        .then(checkOk)
        .then(({ body }) => body);
}

const makeSimple = (film, studio, actor = null) => {
    const simple = {
        _id: film._id,
        title: film.title,
        released: film.released
    };

    if(studio) {
        simple.studio = {
            _id: studio._id,
            name: studio.name
        };
    }
    
    if(actor) {
        simple.cast = film.cast;
        simple.cast[0] = {
            _id: simple.cast[0]._id,
            role: simple.cast[0].role,
            actor: {
                _id: actor._id,
                name: actor.name
            }
        };
    }
    return simple;
};

let inceptionFilm;
let legendaryStudio;
let leoActor;

const legendary = {
    name: 'Legendary',
    address: {
        city: 'Santa Monica',
        state: 'CA',
        country: 'United States'
    }
};

const leo = { 
    name:'Leonardo DiCaprio',
    dob: new Date('1980-11-12'),
    pob: 'Beaverton, OR'
};

describe('Films API', () => {

    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));
    
    beforeEach(() => {
        return request
            .post('/api/studios')
            .send(legendary)
            .then(checkOk)
            .then(({ body }) => legendaryStudio = body);
    });

    beforeEach(() => {
        return request
            .post('/api/actors')
            .send(leo)
            .then(checkOk)
            .then(({ body }) => leoActor = body);
    });

    beforeEach(() => {
        return save({
            title: 'Inception',
            studio: legendaryStudio._id,
            released: 2010,
            cast: [{
                role: 'Cobb',
                actor: leoActor._id
            }]
        })
            .then(data => inceptionFilm = data);
    });

    it('saves a film to the database', () => {
        assert.isOk(inceptionFilm._id);
    });

    it('gets all films from the database', () => {
        let dunkirkFilm;
        return save({
            title: 'Dunkirk',
            studio: legendaryStudio._id,
            released: 2017,
        })
            .then(data => {
                dunkirkFilm = data;
                return request.get('/api/films');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [
                    makeSimple(inceptionFilm, legendaryStudio),
                    makeSimple(dunkirkFilm, legendaryStudio)
                ]);
            });
    });

    it('gets a single film by ID', () => {
        return request
            .get(`/api/films/${inceptionFilm._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, makeSimple(inceptionFilm, legendaryStudio, leoActor));
            });
    });
});
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

let inceptionFilm;
/* eslint-disable-next-line  */
let legendaryStudio;
/* eslint-disable-next-line  */
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
    pob: 'Portland, OR'
};

describe.only('Films API', () => {

    beforeEach(() => dropCollection('films'));
    
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

    xit('gets all films from the db', () => {
        return request
            .get('/api/films')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, inceptionFilm);
            });
    });
});
const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const actor = require('../../lib/models/actor');
const studio = require('../../lib/models/studio');

const checkOk = res => {
    assert.equal(res.status, 200, 'expected http 200 status code');
    return res;
};

describe.only('Films API', () => {

    beforeEach(() => dropCollection('films'));

    function save(film) {
        return request
            .post('/api/films')
            .send(film)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let inceptionFilm;
    
    const inception = {
        title: 'Inception',
        studio: studio._id,
        released: 2010,
        cast: [{
            role: 'Cobb',
            actor: actor._id
        }]
    };

    beforeEach(() => {
        return save(inception)
            .then(data => inceptionFilm = data);
    });

    it('saves a film to the database', () => {
        assert.isOk(inceptionFilm._id);
    });

    xit('gets all actors from the db', () => {
        return request
            .get('/api/actors')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, inceptionFilm);
            });
    });
});
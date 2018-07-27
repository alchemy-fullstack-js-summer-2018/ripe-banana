const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk, simplify } = request;

describe('Films API', () => {
    
    beforeEach(() => {
        dropCollection('films');
        dropCollection('studios');
        dropCollection('actors');
        dropCollection('reviewers');
    });
    
    let dracula;
    let machete;
    let universal;
    let winonaRyder;
    let donJohnson;
    let token;

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Chip Ellsworth III',
                company: 'Fermented Banana',
                email: 'chip@fermentedbanana.com',
                password: 'pw123',
                roles: ['admin']
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    function saveFilm(film) {
        return request
            .post('/api/films')
            .set('Authorization', token)
            .send(film)
            .then(checkOk)
            .then(({ body }) => body);
    }

    function saveStudio(studio) {
        return request
            .post('/api/studios')
            .set('Authorization', token)
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    function saveActor(actor) {
        return request
            .post('/api/actors')
            .set('Authorization', token)
            .send(actor)
            .then(checkOk)
            .then(({ body }) => body);
    }
    // Save a studio and then an actor
    
    beforeEach(() => {
        return saveStudio({
            name: 'Universal',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            }
        })
            .then(data => {
                universal = data;
            });
    });

    beforeEach(() => {
        return saveActor({
            name: 'Winona Ryder',
            dob: new Date(1971, 9, 29),
            pob: 'MN'
        })
            .then(data => {
                winonaRyder = data;
            });
    });

    beforeEach(() => {
        return saveActor({
            name: 'Don Johnson',
            dob: new Date(1949, 11, 15),
            pob: 'MO'
        })
            .then(data => {
                donJohnson = data;
            });
    }); 

    beforeEach(() => {
        return Promise.all([
            saveFilm({ 
                title: 'Machete',
                studio: universal._id,
                released: 2010,
                cast: [{
                    role: 'Von Jackson',
                    actor: donJohnson._id
                }]
            }),
            saveFilm({ 
                title: 'Dracula',
                studio: universal._id,
                released: 1992,
                cast: [{
                    role: 'Mina Harker',
                    actor: winonaRyder._id
                }]
            })

        ])
            .then(([m, d]) => {
                machete = m;
                dracula = d;

            });
    });

    it('saves a film', () => {
        assert.isOk(dracula._id);
        assert.isOk(machete._id);
    });

    it('get a film by id', () => {
        return request
            .get(`/api/films/${dracula._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.studio.name, 'Universal');
                assert.equal(body.cast[0].actor.name, 'Winona Ryder');
            });
    });

    it('gets all films', () => {
        dracula = {
            _id: dracula._id,
            title: dracula.title,
            released: dracula.released,
            cast: [{
                _id: dracula.cast[0]._id,
                role: dracula.cast[0].role,
                actor: simplify(winonaRyder)
            }],
            studio: simplify(universal)
        };
        machete = {
            _id: machete._id,
            title: machete.title,
            released: machete.released,
            cast: [{
                _id: machete.cast[0]._id,
                role: machete.cast[0].role,
                actor: simplify(donJohnson)
            }],
            studio: simplify(universal)
        };
        return request
            .get('/api/films')
            .then(checkOk) 
            .then(({ body }) => {
                assert.deepEqual(body, [machete, dracula]);
            });    
    });

    it('deletes a film', () => {
        return request
            .delete(`/api/films/${dracula._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/films');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.length, 1);
            });
    });
});
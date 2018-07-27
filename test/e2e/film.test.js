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

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Tyrone Payton',
                company: 'Fermented Banana',

                email: 'tyrone@banana.com',
                password: 'abc123',
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

    let universal;

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

    let winonaRyder;

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
    let donJohnson;

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

    let dracula;
    let machete;
    
    beforeEach(() => {
        return saveFilm({ 
            title: 'Dracula',
            studio: universal._id,
            released: 1992,
            cast: [{
                role: 'Mina Harker',
                actor: winonaRyder._id
            }]
        })
            .then(data => dracula = data);
    });

    beforeEach(() => {
        return saveFilm({ 
            title: 'Machete',
            studio: universal._id,
            released: 2010,
            cast: [{
                role: 'Von Jackson',
                actor: donJohnson._id
            }]
        })
            .then(data => machete = data);
    });

    it('saves a film', () => {
        assert.isOk(machete._id);
    });

    it('get a film by id', () => {
        return request
            .get(`/api/films/${dracula._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.studio.name, 'Universal');
                assert.equal(body.cast[0].actor.name, 'Winona Ryder');
            });
    });

    it('gets all films', () => {
        return request
            .get('/api/films')
            .set('Authorization', token)
            .then(checkOk) 
            .then(({ body }) => {
                body.forEach(e => {
                    delete e.__v;
                });
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
                
                assert.deepEqual(body, [dracula, machete]);
            });    
    });

    it('deletes a film', () => {
        return request
            .delete(`/api/films/${machete._id}`)
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
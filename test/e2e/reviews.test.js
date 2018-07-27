const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk, simplify } = request;

describe('Reviews API', () => {
    
    beforeEach(() => dropCollection('reviews'));
    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('actors'));

    let token;
    let tyrone;
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
                tyrone = body.reviewer;
            });
    });
    
    let amazing, horrible;
    let winonaRyder, donJohnson;
    let universal;
    let dracula, machete;

    //*** save film function ***
    function saveFilm(film) {
        return request
            .post('/api/films')
            .set('Authorization', token)
            .send(film)
            .then(checkOk)
            .then(({ body }) => body);
    }

    //*** save review function ***
    function saveReview(review) {
        return request
            .post('/api/reviews')
            .set('Authorization', token)
            .send(review)
            .then(checkOk)
            .then(({ body }) => body);
    }

    //*** save actor function
    function saveActor(actor) {
        return request
            .post('/api/actors')
            .set('Authorization', token)
            .send(actor)
            .then(checkOk)
            .then(({ body }) => body);
    }

    //*** save a studio function
    function saveStudio(studio) {
        return request
            .post('/api/studios')
            .set('Authorization', token)
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    beforeEach(() => {
        return saveActor({
            name: 'Winona Ryder',
            dob: new Date(1971, 9, 29),
            pob: 'MN'
        })
            .then(data => winonaRyder = data);
    });

    beforeEach(() => {
        return saveActor({
            name:'Don Johnson',
            dob: new Date(1949, 11, 15),
            pob: 'MO'
        })
            .then(data => donJohnson = data);
    });

    beforeEach(() => {
        return saveStudio({
            name: 'Universal',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            }
        })
            .then(data => universal = data);

    });

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

    beforeEach(() => {
        return saveReview({
            rating: 5,
            reviewer: tyrone._id,
            review: 'This is amazing',
            film: dracula._id
        })
            .then(data =>  amazing = data);
    });
    beforeEach(() => {
        return saveReview({
            rating: 1,
            reviewer: tyrone._id,
            review: 'This is horrible',
            film: machete._id
        })
            .then(data => horrible = data);
    });

    it('saves a review', () => {
        assert.isOk(amazing._id);
        assert.isOk(horrible._id);
    });

    it('gets all reviews(up to a hundred)', () => {
        return request
            .get('/api/reviews')
            .then(checkOk)
            .then(({ body }) => {
                body.forEach(e => {
                    delete e.__v;
                    delete e.updated_at;
                    delete e.created_at;
                });
                
                amazing = {
                    _id: amazing._id,
                    rating: amazing.rating,
                    reviewer: simplify(tyrone),
                    review: amazing.review,
                    film: simplify(dracula)
                };
            
                horrible = {
                    _id: horrible._id,
                    rating: horrible.rating,
                    reviewer: simplify(tyrone),
                    review: horrible.review,
                    film: simplify(machete)
                };
                assert.deepEqual(body, [amazing, horrible]);
            });
    });
});
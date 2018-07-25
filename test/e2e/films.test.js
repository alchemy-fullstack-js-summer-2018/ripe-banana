const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe.only('Films API', () => {

    beforeEach(() => {
        dropCollection('reviews');
        dropCollection('reviewers');
        dropCollection('actors');
        dropCollection('films');
        dropCollection('studios');
    });

    let token;
    let reviewer;
    beforeEach(() => {
        return request
            .post('/api/reviewers/signup')
            .send({ 
                name: 'Easton',
                company: 'ACL',
                email: 'easton@portland.com',
                password: 'adamngoodone',
                roles: ['admin']
            })
            .then(({ body }) => {
                token = body.token;
                reviewer = body.reviewer;
            });
    });

    function save(film) {
        return request
            .post('/api/films')
            .send(film)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let studio;
    beforeEach(() => {
        return request  
            .post('/api/studios')
            .set('Authorization', token)
            .send({ name: 'SortaGood Pictures' })
            .then(({ body }) => studio = body);
    });

    let actor;
    beforeEach(() => {
        return request
            .post('/api/actors')
            .send({ name: 'Arthur' })
            .set('Authorization', token)
            .then(({ body }) => actor = body);
    });

    let film;
    beforeEach(() => {
        return save({
            title: 'Injoong Strikes Back',
            studio: studio._id,
            released: 2018,
            cast: [{
                role: 'Mr. Yoon',
                actor: actor._id
            }]  
        })
            .then(data => {
                film = data;
            });
    });

    let review;
    beforeEach(() => {
        return request  
            .post('/api/reviews')
            .set('Authorization', token)
            .send({ 
                rating: 5,
                reviewer: reviewer._id,
                review: 'Another great Injoong Flick!',
                film: film._id })
            .then(({ body }) => review = body);
    });

    const makeSimple = (film, studio) => {
        const simple = {
            _id: film._id,
            title: film.title,
            released: film.released
        };
        if(studio){
            simple.studio = {
                _id: studio._id,
                name: studio.name
            };
        }
        return simple;
    };

    const makeSimpleTwo = (film, studio, reviewer, review, actor) => {
       
        const simple = {
            _id: film._id,
            title: film.title,
            released: film.released,
            cast: film.cast
        };
        if(studio){
            simple.studio = {
                _id: studio._id,
                name: studio.name
            };
        }
        if(actor) {
            simple.cast[0].actor = {
                _id: actor._id,
                name: actor.name
            };
        }
        if(review) {
            simple.reviews = [{
                _id: review._id,
                rating: review.rating,
                review: review.review
            }];
        }
        if(reviewer) {
            simple.reviews[0].reviewer = reviewer;
        }
        return simple;
    };

    it('saves a film', () => {
        assert.isOk(film._id);
        
    });

    it('gets all films', () => {
        let bmovie;
        return save({ 
            title: 'B Movie film',
            studio: studio._id,
            released: 2018
        })
            .then(_bmovie => {
                bmovie = _bmovie;
                return request.get('/api/films');  
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [
                    makeSimple(film, studio),
                    makeSimple(bmovie, studio)
                ]);
            });
    });

    it('gets a film by id', () => {
        return request
            .get(`/api/films/${film._id}`)
            .then(({ body }) => {
                delete body.__v;
                delete body.reviews[0].reviewer.__v;
                assert.deepEqual(body, makeSimpleTwo(film, studio, reviewer, review, actor));
            });      
    });

    it('removes a film', () => {
        return request
            .delete(`/api/films/${film._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(res => {
                assert.deepEqual(res.body, { removed: true });
                return request.get('/api/films');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, []);
            });      
    });  
});


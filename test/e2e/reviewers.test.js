const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Reviewer API', () => {

    beforeEach(() => {
        dropCollection('reviews');
        dropCollection('reviewers');
        dropCollection('actors');
        dropCollection('films');
        dropCollection('studios');
    });

    function save(reviewer) {
        return request
            .post('/api/reviewers/signup')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let token; 
    let bobby;
    beforeEach(() => {
        return request
            .post('/api/reviewers/signup')
            .send({
                name: 'Bobby',
                company: 'Student',
                email: 'bobby@portland.com',
                password: '123',
                roles: ['admin']
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                bobby = body.reviewer;
            });
    });

    // let bobby;
    // beforeEach(() => {
    //     return save({
    //         name: 'Bobby',
    //         company: 'Unemployed'
    //     })
    //         .then(data => bobby = data);
    // });

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
            .set('Authorization', token)
            .send({ name: 'Arthur' })
            .then(({ body }) => actor = body);
    });

    let film;
    beforeEach(() => {
        return request  
            .post('/api/films')
            .set('Authorization', token)
            .send({ 
                title: 'Injoong Strikes Back',
                studio: studio._id,
                released: 2018,
                cast: [{
                    role: 'Mr. Yoon',
                    actor: actor._id
                }]    
            })
            .then(({ body }) => film = body);
    });

    let review;
    beforeEach(() => {
        return request  
            .post('/api/reviews')
            .set('Authorization', token)
            .send({ 
                rating: 5,
                reviewer: bobby._id,
                review: 'Another great Injoong Flick!',
                film: film._id 
            })
            .then(({ body }) => review = body);
    });

    const makeSimple = (reviewer, review, film) => {
        const simple = {
            _id: reviewer._id,
            name: reviewer.name,
            company: reviewer.company
        };
        if(review){
            simple.reviews = [{
                _id: review._id,
                rating: review.rating,
                review: review.review,
                film: review.film
            }];
        }
        if(film) {
            simple.reviews[0].film = {
                _id: film._id,
                title: film.title
            };
        }
        return simple;
    };

    it('signs up a user', () => {
        assert.isDefined(token);
    });

    // it('verifies a token', () => {
    //     assert.isDefined(token);
    // });

    it('can sign in a user', () => {
        return request
            .post('/api/reviewers/signin')
            .send({
                email: 'bobby@portland.com',
                password: '123'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    it('saves a reviewer', () => {
        assert.isOk(bobby._id);
    });

    it('gets all reviewers', () => {
        let carrie;
        return save({ 
            name: 'carrie',
            company: 'Student',
            email: 'carrie@portland.com',
            password: 'carrie'
        })
            .then(_carrie => {
                carrie = _carrie.reviewer;
                return request.get('/api/reviewers');  
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [bobby, carrie]);
            });
    });

    it('gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${bobby._id}`)
            .then(({ body }) => {
                delete body.__v;
                assert.deepEqual(body, makeSimple(bobby, review, film));
            });
    });

    it('updates a reviewer', () => {
        bobby.name = 'Robert';
        return request 
            .put(`/api/reviewers/${bobby._id}`)
            .set('Authorization', token)
            .send(bobby)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, bobby);
            });
    });
});
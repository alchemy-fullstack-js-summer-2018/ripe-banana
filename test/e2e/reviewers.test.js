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
            .post('/api/reviewers')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let bobby;
    beforeEach(() => {
        return save({
            name: 'Bobby',
            company: 'Unemployed'
        })
            .then(data => bobby = data);
    });

    let studio;
    beforeEach(() => {
        return request  
            .post('/api/studios')
            .send({ name: 'SortaGood Pictures' })
            .then(({ body }) => studio = body);
    });

    let actor;
    beforeEach(() => {
        return request
            .post('/api/actors')
            .send({ name: 'Arthur' })
            .then(({ body }) => actor = body);
    });

    let film;
    beforeEach(() => {
        return request  
            .post('/api/films')
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

    it('saves a reviewer', () => {
        assert.isOk(bobby._id);
    });

    it('gets all reviewers', () => {
        let carrie;
        return save({ 
            name: 'carrie',
            company: 'Student'
        })
            .then(_carrie => {
                carrie = _carrie;
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
            .send(bobby)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, bobby);
            });
    });

});
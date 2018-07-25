const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Review API', () => {

    beforeEach(() => {
        dropCollection('reviews');
        dropCollection('reviewers');
        dropCollection('films');
        dropCollection('studios');
    });

    let token;
    let kevin;
    beforeEach(() => {
        return request
            .post('/api/reviewers/signup')
            .send({ 
                name: 'Kevin',
                company: 'Kevin at the Movies, LLC',
                email: 'kevin@portland.com',
                password: 'kevin'
            })
            .then(({ body }) => {
                token = body.token;
                kevin = body.reviewer;
            });
    });

    let studio;
    beforeEach(() => {
        return request  
            .post('/api/studios')
            .send({ name: 'SortaGood Pictures' })
            .then(({ body }) => studio = body);
    });

    let film;
    beforeEach(() => {
        return request
            .post('/api/films')
            .send({
                title: 'Return of Injoong',
                studio: studio._id,
                released: 2017
            })    
            .then(({ body }) => {
                film = body;
            });
    });
    
    let review;
    beforeEach(() => {
        return request
            .post('/api/reviews')
            .set('Authorization', token)
            .send({
                rating: 4,
                reviewer: kevin._id,
                review: 'Kevin says this is the 2nd best Injoong movie out there.',
                film: film._id,
            })
            .then(checkOk)
            .then(({ body }) => {
                review = body;
            }); 
    });

    const makeSimple = (review, film) => {
        const simple = {
            _id: review._id,
            rating: review.rating,
            review: review.review
        };

        if(film){
            simple.film = {
                _id: film._id,
                title: film.title
            };
        }
        return simple;
    };

    it('saves a review', () => {
        assert.isOk(review._id);
    });

    it('returns first 100 reviews', () => {
        return request
            .get('/api/reviews')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [makeSimple(review, film)]);
            });
    });
});
const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;
const { saveActor, saveFilm, saveReview, saveStudio } = require('./helpers');

describe('Review API', () => {

    beforeEach(() => {
        dropCollection('reviews');
        dropCollection('reviewers');
        dropCollection('films');
        dropCollection('studios');
        dropCollection('actors');
    });

    let token;
    let kevin;
    beforeEach(() => {
        let data = { 
            name: 'Kevin',
            company: 'Kevin at the Movies, LLC',
            email: 'kevin@themovies.com',
            roles: ['admin'],
            hash: '09870987'
        };
        return request
            .post('/api/auth/signup')
            .send(data)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                delete body.kevin.__v;
                kevin = body.kevin;
            });

    });

    let studio;
    beforeEach(() => {
        return saveStudio(
            {
                name: 'SortaGood Pictures',
                address: {
                    city: 'Portland',
                    state: 'OR',
                    country: 'USA'
                }
            },
            token
        )
            .then(data => {
                studio = data;
            });
            
    });

    let arthur;
    beforeEach(() => {
        return saveActor(
            {
                name: 'Arthur Jen'
            },
            token
        )
            .then(data => { 
                arthur = data;
            });
    });

    let film;
    beforeEach(() => {
        return saveFilm(
            {
                title: 'Return of Injoong',
                studio: studio._id,
                released: 2017,
                cast: [{
                    role: 'Injoong Yoon',
                    actor: arthur._id
                }]
            },
            token
        )    
            .then(data => {
                film = data;
            });
    });
    
    
    let review;
    beforeEach(() => {
        return saveReview(
            {
                rating: 4,
                reviewer: kevin._id,
                review: 'Kevin says this is the 2nd best Injoong movie out there.',
                film: film._id,
            },
            token
        )
            .then(data => {
                review = data;
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
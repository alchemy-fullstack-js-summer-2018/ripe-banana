const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { Types } = require('mongoose');
const { checkOk } = request;


const makeSimple = (review, film) => {
    const simple = {
        _id: review._id,
        rating: review.rating,
        review: review.review,
        createdAt: review.createdAt
    };

    if(film) {
        simple.film = {
            _id: film._id,
            title: film.title
        };
    }

    return makeSimple;
};


describe('Reviews API', () => {

    beforeEach(() => dropCollection('reviews'));
    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    
    
    //let movieFilm;
    //let reviewerSue;
    let reviewA;
    //let actorBob;
    let token;
    
    // function saveReview(review) {
    //     return request
    //         .post('/api/reviews')
    //         .set('Authorization', token)
    //         .send(review)
    //         .then(checkOk)
    //         .then(({ body }) => body);
    // }
    
    beforeEach(() => {
        return signup(
            {
                name: 'Betty Crocker',
                email: 'crock@email.com',
                company: 'Pancake Hut',
                password: 'abc12345',
                roles: ['admin']
            })
        
            .then(body => {
                token = body.token;
            });      
    });

    function signup(reviewer) {
        return request
            .post('/api/reviewers/signup')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }


    function saveReview(review) {
        return request
            .post('/api/reviews')
            .set('Authorization', token)
            .send(review)
            .then(checkOk)
            .then(({ body }) => body);
    }
    
    beforeEach(() => {
        return saveReview({
            rating: 3,
            review: 'movies and films and stuff oh my',
            film: Types.ObjectId()
        })
            .then(data => reviewA = data);
    });

    it('saves a review', () => {
        assert.isOk(reviewA._id);
    });
});

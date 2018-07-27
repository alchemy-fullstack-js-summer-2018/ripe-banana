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
    beforeEach(() => dropCollection('actors'));
    beforeEach(() => dropCollection('studios'));
    
    
    let movieFilm;
    let actorBob;
    let reviewerSue;
    let studioCo;
    let reviewA;
    let token;

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
    // function saveReviewer(reviewer) {
    //     return request
    //         .post('/api/reviewers')
    //         .send(reviewer)
    //         .then(checkOk)
    //         .then(({ body }) => body);
    // }

    // beforeEach(() => {
    //     return saveReviewer({
    //         name: 'Reviewer Sue',
    //         email: 'sue@email.com',
    //         company: 'ReviewsRUs',
    //         roles: ['admin']   
    //     })
    //         .then(data => reviewerSue = data);
    // });

    // function saveActor(actor) {
    //     return request
    //         .post('/api/actors')
    //         .send(actor)
    //         .then(checkOk)
    //         .then(({ body }) => body);
    // }

    // beforeEach(() => {
    //     return saveActor({
    //         name: 'Actor Bob',
    //         dob: new Date(1970, 10, 23),
    //         pob: 'NYC'
    //     })
    //         .then(data => actorBob = data);
    // });

    // function saveStudio(studio) {
    //     return request
    //         .post('/api/studios')
    //         .send(studio)
    //         .then(checkOk)
    //         .then(({ body }) => body);
    // }

    // beforeEach(() => {
    //     return saveStudio({
    //         name: 'Studio Co',
    //         address: {
    //             city: 'NYC',
    //             state: 'NY',
    //             country: 'USA'
    //         }
    //     })
    //         .then(data => studioCo = data);
    // });


    // function saveFilm(film) {
    //     return request
    //         .post('/api/films')
    //         .send(film)
    //         .then(checkOk)
    //         .then(({ body }) => body);
    // }

    // beforeEach(() => {
    //     return saveFilm({
    //         title: 'Movie Film',
    //         studio: studioCo._id,
    //         released: 1989,
    //         cast: [{
    //             role: 'Bro Dude',
    //             actor: actorBob._id
    //         }]
    //     })
    //         .then(data => movieFilm = data);
    // });


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

    it.only('saves a review', () => {
        assert.isOk(reviewA._id);
    });

    it('gets 100 most recent reviews', () => {
        return request
            .get('/api/reviews')
            .then(checkOk)
            .then(({ body }) => {
                body.forEach(r => {
                    delete r.reviewer._id;
                    delete r.film._id;
                    delete r.updatedAt;
                    delete r.createdAt;
                    delete r.__v;
                });

                reviewA = {
                    _id: reviewA._id,
                    rating: reviewA.rating,
                    reviewer: {
                        name: reviewerSue.name
                    },
                    review: reviewA.review,
                    film: {
                        title: movieFilm.title
                    } 
                };
               
                assert.deepEqual(body[0], reviewA);
            });
    });
});

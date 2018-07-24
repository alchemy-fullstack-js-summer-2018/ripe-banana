const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;
const { saveActor, saveFilm, saveReview, saveReviewer, saveStudio, makeReview } = require('./_helpers');

describe('Reviews API', () => {

    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('reviews'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));

    let ebert;
    beforeEach(() => {
        return saveReviewer({
            name: 'Roger Ebert',
            company: 'Ebert Reviews'
        })
            .then(data => {
                ebert = data;
            });
    });
    
    let warner;
    beforeEach(() => {
        return saveStudio({
            name: 'Warner',
            address: {
                city: 'Los Angeles',
                state: 'California',
                country: 'USA'
            }
        })
            .then(data => {
                warner = data;
            });
    });
    
    let downey; 
    beforeEach(() => {
        return saveActor({
            name: 'Robert Downey Jr.'
        })
            .then(data => {
                downey = data;
            });       
    });

    let avengers;
    beforeEach(() => {
        return saveFilm({
            title: 'Avengers',
            studio: warner._id,
            released: 2015,
            cast: [{
                role: 'Tony Stark',
                actor: downey._id
            }]
        })
            .then(data => {
                avengers = data;
            });
    });

    let review1;
    beforeEach(() => {
        return saveReview({
            rating: 5,
            reviewer: ebert._id,
            review: 'this is good',
            film: avengers._id,
        })
            .then(data => {
                review1 = data;
            });
    });

    it('Saves a review', () => {
        assert.isOk(review1._id);
    });

    it('Gets a list of reviews', () => {
        let review2;
        return saveReview({
            rating: 3,
            reviewer: ebert._id,
            review: 'this is terrible',
            film: avengers._id,
        })
            .then(data => {
                review2 = data;
                return request.get('/api/reviews');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [makeReview(review1, avengers), makeReview(review2, avengers)]);
            });
    });

    it('Updates a reviews by id', () => {
        review1.rating = 1;
        review1.review = 'BEST MOVIE EVER...NOT';
        return request
            .put(`/api/reviews/${review1._id}`)
            .send(review1)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body.rating, review1.rating);
                assert.deepEqual(body.review, review1.review);
            });
    });
});
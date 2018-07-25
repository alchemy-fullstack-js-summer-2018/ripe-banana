const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, saveAll, makeSimple } = request;
const { Types } = require('mongoose');

describe('Reviews API', () => {

    beforeEach(() => dropDatabase());

    let token;
    beforeEach(() => {
        return request
            .post('/api/reviewers/signup')
            .send({
                name: 'Mariah',
                email: 'test@test.com',
                company: 'Alchemy Movie Lab',
                password: 'abc123'
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });
    
    let mariahReview;
    const data = {
        rating: 5,
        reviewer: Types.ObjectId(),
        review: 'Tom Hanks is the best!',
        film: Types.ObjectId(),
    }

    beforeEach(() => {
        return request
            .post('/api/reviews')
            .set('Authorization', token)
            .send(data)
            .then(({ body }) => {
                mariahReview = body; 
            });
    });

    it('returns error if posting without valid token', () => {
        
    });
    
    // let banks;
    // let mariahReview, arthurReview;
    
    // before(() => {
    //     return saveAll()
    //         .then(data => {
    //             banks = data.films[0];
    //             [mariahReview, arthurReview] = data.reviews;
    //         });
    // });

    it.only('saves a review', () => {
        assert.isOk(mariahReview._id);
        // assert.isOk(arthurReview._id);
    });

    it.skip('returns all reviews on GET', () => {
        return request
            .get('/api/reviews')
            .then(checkOk)
            .then(({ body }) => {
                mariahReview = {
                    _id: mariahReview._id,
                    rating: mariahReview.rating,
                    review: mariahReview.review,
                    film: makeSimple(banks)
                };
                arthurReview = {
                    _id: arthurReview._id,
                    rating: arthurReview.rating,
                    review: arthurReview.review,
                    film: makeSimple(banks)
                };
                assert.deepEqual(body, [mariahReview, arthurReview]);
            });
    });

});
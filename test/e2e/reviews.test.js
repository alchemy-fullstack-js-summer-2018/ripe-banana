const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, saveAll, makeSimple } = request;
const { Types } = require('mongoose');

describe.only('Reviews API', () => {

    beforeEach(() => dropDatabase());
    let token;
    beforeEach(() => {
        const data = {
            name: 'Arthur Jen',
            email: 'arthur@gmail.com',
            password: 'whatever',
            company: 'Alchemy Movie Lab'
        };
        return request
            .post('/api/reviewers/signup')
            .send(data)
            .then(checkOk)
            .then(({ body }) => token = body.token);
    });

    let mariahReview;
    beforeEach(() => {

        const data = {
            rating: 5,
            // reviewer: Types.ObjectId(),
            review: 'Tom Hanks is the best!',
            film: Types.ObjectId(),
        };
        return request
            .post('/api/reviews')
            .set('Authorization', token)
            .send(data)
            .then(checkOk)
            .then(({ body }) => mariahReview = body);
    });

    it('returns error if posting without valid token', () => {
        return request
            .post('/api/reviews')
            .set('Authorization', 'bad-token')
            .send({})
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid or missing token');
            });
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

    it('saves a review', () => {
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
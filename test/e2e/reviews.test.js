const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, save, saveWithAuth, makeSimple } = request;
const { Types } = require('mongoose');


describe('Reviews API', () => {

    beforeEach(() => dropDatabase());
    
    let token;
    let banks;
    beforeEach(() => {
        const data = {
            title: 'Saving Mr. Banks',
            studio: Types.ObjectId(),
            released: 2013,
            cast: []
        };
        return save(data, 'films')
            .then(body => banks = body);
    });

    beforeEach(() => {
        const data = {
            name: 'Arthur Jen',
            email: 'arthur@gmail.com',
            password: 'whatever',
            company: 'Alchemy Movie Lab'
        };
        return save(data, 'reviewers/signup')
            .then(body => {
                token = body.token;
            });
    });

    let review;
    beforeEach(() => {
        const data = {
            rating: 5,
            review: 'Tom Hanks is the best!',
            film: banks._id
        };
        return saveWithAuth(data, 'reviews', token)
            .then(body => review = body);
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

    it('saves a review', () => {
        assert.isOk(review._id);
    });

    it('returns all reviews on GET', () => {
        return request
            .get('/api/reviews')
            .then(checkOk)
            .then(({ body }) => {
                review = {
                    _id: review._id,
                    rating: review.rating,
                    review: review.review,
                    film: makeSimple(banks)
                };
                assert.deepEqual(body, [review]);
            });
    });

});
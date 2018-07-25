const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, saveReviewersData, makeSimple } = request;

describe('Reviewers API', () => {

    beforeEach(() => dropDatabase());

    // let arthur, mariah;
    // let review;
    // let banks;

    // before(() => {
    //     return saveReviewersData()
    //         .then(data => {
    //             [arthur, mariah] = data.reviewers;
    //             review = data.reviews[1];
    //             banks = data.films[0];
    //         });
    // });

    // it('saves a reviewer', () => {
    //     assert.isOk(arthur._id);
    //     assert.isOk(mariah._id);
    // });
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
    
    
    it('signs up a user', () => {
        assert.isDefined(token);
    });

    it('signs in a user', () => {
        return request
            .post('/api/reviewers/signin')
            .send({
                email: 'arthur@gmail.com',
                password: 'whatever'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    it('verifies a token', () => {
        return request
            .get('/api/reviewers/verify')
            .set('Authorization', token)
            .then(checkOk);
    });

    it('fails on wrong password', () => {
        return request
            .post('/api/reviewers/signin')
            .send({
                email: 'arthur@gmail.com',
                password: 'bad'
            })
            .then(res => {
                assert.equal(res.status, 401);
                assert.equal(res.body.error, 'Invalid email or password');
            });
    });

    it('cannot signup with same email', () => {
        return request
            .post('/api/reviewers/signup')
            .send({
                email: 'arthur@gmail.com',
                password: 'bad'
            })
            .then(res => {
                assert.equal(res.status, 400);
                assert.equal(res.body.error, 'Email is already registered');
            });
    });

    it.skip('returns all reviewers on GET', () => {
        return request
            .get('/api/reviewers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [arthur, mariah]);
            });
    });


    it.skip('returns a reviewer on GET', () => {
        return request
            .get(`/api/reviewers/${arthur._id}`)
            .then(checkOk)
            .then(({ body }) => {
                arthur.reviews = [{
                    _id: review._id,
                    rating: review.rating,
                    review: review.review,
                    film: makeSimple(banks)
                }];
                assert.deepEqual(body, arthur);
            });
    });

    it.skip('updates a reviewer', () => {
        arthur.company = 'Netflix';
        return request
            .put(`/api/reviewers/${arthur._id}`)
            .send(arthur)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                delete arthur.reviews;
                assert.deepEqual(body, arthur);
            });
    });
});
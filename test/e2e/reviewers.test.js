const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, save, saveWithAuth, makeSimple } = request;
const { Types } = require('mongoose');

describe.only('Reviewers API', () => {

    beforeEach(() => dropDatabase());

    // let mariah;
    // let review;
    // let banks;

    // before(() => {
    //     return saveReviewerData()
    //         .then(data => {
    //             [mariah] = data.reviewers;
    //             review = data.reviews[0];
    //             banks = data.films[0];
    //         });
    // });

    // it('saves a reviewer', () => {
    //     assert.isOk(mariah._id);
    // });
    let token;
    let arthur;
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
                delete body.reviewer.__v;
                arthur = body.reviewer;
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

    it('returns all reviewers on GET', () => {
        return request
            .get('/api/reviewers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [arthur]);
            });
    });


    it('returns a reviewer on GET', () => {
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

    it('updates a reviewer', () => {
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
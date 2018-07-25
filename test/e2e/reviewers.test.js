const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, saveAll, makeSimple } = request;

describe('Reviewers API', () => {

    before(() => dropDatabase());

    // let arthur, mariah;
    // let review;
    // let banks;

    // before(() => {
    //     return saveAll()
    //         .then(data => {
    //             [arthur, mariah] = data.reviewers;
    //             review = data.reviews[1];
    //             banks = data.films[0];
    //         });
    // });

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

    it('signs up a user', () => {
        assert.isDefined(token);
    });

    // it.only('verifies a token', () => {
    //     return request
    //         .get('/api/reviewers/verify')
    //         // .set('Authorization', token)
    //         .then(checkOk);
    // });

    it('signs in a user', () => {
        return request
            .post('/api/reviewers/signin')
            .send({
                name: 'Mariah',
                email: 'test@test.com',
                company: 'Alchemy Movie Lab',
                password: 'abc123'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    /* old tests */
    it.skip('saves a reviewer', () => {
        assert.isOk(arthur._id);
        assert.isOk(mariah._id);
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
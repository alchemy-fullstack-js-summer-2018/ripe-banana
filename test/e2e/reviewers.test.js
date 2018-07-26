const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, save, saveWithAuth, makeSimple } = request;
const { Types } = require('mongoose');

describe('Reviewers API', () => {

    beforeEach(() => dropDatabase());

    let mariah;
    let token;
    beforeEach(() => {
        const data = {
            name: 'Mariah Adams',
            email: 'test@test.com',
            company: 'Alchemy Movie Lab',
            password: 'abc123',
            roles: ['admin']
        };
        return save(data, 'reviewers/signup')
            .then(body => {
                token = body.token;
                delete body.reviewer.__v;
                mariah = body.reviewer;
            });
    });

    let banks;
    beforeEach(() => {
        const data = {
            title: 'Saving Mr. Banks',
            studio: Types.ObjectId(),
            released: 2013,
            cast: []
        };
        return save(data, 'films')
            .then(body => {
                banks = body;
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

    it('verifies a token', () => {
        return request
            .get('/api/reviewers/verify')
            .set('Authorization', token)
            .then(checkOk);
    });

    it('signs in a user', () => {
        return request
            .post('/api/reviewers/signin')
            .send({
                name: 'Mariah Adams',
                email: 'test@test.com',
                password: 'abc123',
                company: 'Alchemy Movie Lab'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });

    it('returns all reviewers on GET', () => {
        return request
            .get('/api/reviewers')
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [mariah]);
            });
    });

    it('returns a reviewer on GET', () => {
        return request
            .get(`/api/reviewers/${mariah._id}`)
            .then(checkOk)
            .then(({ body }) => {
                mariah.reviews = [{
                    _id: review._id,
                    rating: review.rating,
                    review: review.review,
                    film: makeSimple(banks)
                }];
                assert.deepEqual(body, mariah);
            });
    });

    it('updates a reviewer', () => {
        mariah.company = 'Netflix';
        return request
            .put(`/api/reviewers/${mariah._id}`)
            .set('Authorization', token)
            .send(mariah)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                delete mariah.reviews;
                assert.deepEqual(body, mariah);
            });
    });
});
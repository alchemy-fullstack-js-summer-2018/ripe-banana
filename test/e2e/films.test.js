const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, save, saveWithAuth, makeSimple } = request;

describe('Films API', () => {

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
        }
        return save(data, 'reviewers/signup')
            .then(body => {
                token = body.token;
                delete body.reviewer.__v;
                mariah = body.reviewer;
            });
    });

    let tom;
    let emma;
    beforeEach(() => {
        const data = {
            name: 'Tom Hanks',
            dob: new Date(1956, 6, 9),
            pob: 'Concord, CA'
        }
        return saveWithAuth(data, 'actors', token)
            .then(body => tom = body);
    });

    beforeEach(() => {
        const data = {
            name: 'Emma Thompson',
            dob: new Date(1959, 3, 15),
            pob: 'London, England'
        }
        return saveWithAuth(data, 'actors', token)
            .then(body => emma = body);
    });

    let disney;
    beforeEach(() => {
        const data = {
            name: 'Disney',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            } 
        };
        return saveWithAuth(data, 'studios', token)
            .then(body => disney = body);
    });

    let banks;
    beforeEach(() => {
        const data = {
            title: 'Saving Mr. Banks',
            studio: disney._id,
            released: 2013,
            cast: [
                {
                    role: 'Walt Disney',
                    actor: tom._id
                },
                {
                    role: 'P.L. Travers',
                    actor: emma._id
                }
            ]
        };
        return saveWithAuth(data, 'films', token)
            .then(body => banks = body);
    });

    let review;
    beforeEach(() => {
        const data = {
            rating: 5,
            review: 'Tom Hanks is the best!',
            film: banks._id
        }
        return saveWithAuth(data, 'reviews', token)
            .then(body => review = body);
    });

    it('saves films', () => {
        assert.isOk(banks._id);
        assert.equal(banks.title, 'Saving Mr. Banks');
    });

    it('returns a film on GET', () => {
        return request
            .get(`/api/films/${banks._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, {
                    _id: banks._id,
                    title: banks.title,
                    studio: makeSimple(disney),
                    released: banks.released,
                    cast: [
                        {
                            _id: banks.cast[0]._id,
                            role: banks.cast[0].role,
                            actor: makeSimple(tom)
                        },
                        {
                            _id: banks.cast[1]._id,
                            role: banks.cast[1].role,
                            actor: makeSimple(emma)
                        }
                    ],
                    reviews: [
                        {
                            _id: review._id,
                            rating: review.rating,
                            review: review.review,
                            reviewer: makeSimple(mariah)
                        }
                    ]
                });
            });
    });

    it('returns all films on GET', () => {
        return request
            .get('/api/films')
            .then(checkOk)
            .then(({ body }) => {
                banks = {
                    _id: banks._id,
                    title: banks.title,
                    released: banks.released,
                    studio: makeSimple(disney)
                };
                assert.deepEqual(body, [banks]);
            });
    });

    it('Removes a film on DELETE', () => {
        return request
            .delete(`/api/films/${banks._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
            });
    });
});
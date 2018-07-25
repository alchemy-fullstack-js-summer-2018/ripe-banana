const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, save, saveWithAuth, makeSimple } = request;

describe('Films API', () => {

    before(() => dropDatabase());

    let tom, emma;
    let banks, gameNight;
    let warner, disney;
    let mariah, arthur;
    let reviewMariah, reviewArthur;

    before(() => {
        return saveAll()
            .then(data => {
                [tom,, emma] = data.actors;
                [arthur, mariah] = data.reviewers;
                [warner, disney] = data.studios;
                [banks, gameNight] = data.films;
                [reviewMariah, reviewArthur] = data.reviews;
            });
    });


    it('saves films', () => {
        assert.isOk(banks._id);
        assert.equal(banks.title, 'Saving Mr. Banks');
        assert.isOk(gameNight._id);
        assert.equal(gameNight.title, 'Game Night');

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
                            _id: reviewMariah._id,
                            rating: reviewMariah.rating,
                            review: reviewMariah.review,
                            reviewer: makeSimple(mariah)
                        },
                        {
                            _id: reviewArthur._id,
                            rating: reviewArthur.rating,
                            review: reviewArthur.review,
                            reviewer: makeSimple(arthur)
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
                gameNight = {
                    _id: gameNight._id,
                    title: gameNight.title,
                    released: gameNight.released,
                    studio: makeSimple(warner)
                };
                assert.deepEqual(body, [banks, gameNight]);
            });
    });

    it('Removes a film on DELETE', () => {
        return request
            .delete(`/api/films/${banks._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
            });
    });
});
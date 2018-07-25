const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, saveStudiosData, makeSimple } = request;

describe('Studios API', () => {

    before(() => dropDatabase());

    let warner, disney;
    let banks, gameNight;

    before(() => {
        return saveStudiosData()
            .then(data => {
                [warner, disney] = data.studios;
                [banks, gameNight] = data.films;
            });
    });    

    it('saves a studio', () => {
        assert.isOk(warner._id);
        assert.isOk(disney._id);
    });

    it('returns a studio on GET', () => {
        return request
            .get(`/api/studios/${disney._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, {
                    _id: disney._id,
                    name: disney.name,
                    address: disney.address,
                    films: [makeSimple(banks)]
                });
            });
    });

    it('returns all studios on GET', () => {
        return request
            .get('/api/studios')
            .then(checkOk)
            .then(({ body }) => {
                delete warner.address;
                delete disney.address;
                delete disney.films;
                assert.deepEqual(body, [warner, disney]);
            });
    });

    it('DOES NOT remove a studio if it exists as a property of a film', () => {
        return request
            .delete(`/api/studios/${warner._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isFalse(body.removed);
            });
    });

    it('Removes a studio on DELETE', () => {
        return request
            .delete(`/api/films/${gameNight._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
                return request
                    .delete(`/api/studios/${warner._id}`);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
            });
    });
    
});
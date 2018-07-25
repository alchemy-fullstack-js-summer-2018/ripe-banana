const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, saveActorData, makeSimple } = request;

describe('Actors API', () => {

    before(() => dropDatabase());

    let tom;
    let rachel;
    let emma;
    let banks;

    before(() => {
        return saveActorData()
            .then(data => {
                [tom, rachel, emma] = data.actors;
                banks = data.films[0];
            });
    });

    it('saves an actor', () => {
        assert.isOk(tom._id);
        assert.equal(tom.name, 'Tom Hanks');
        assert.isOk(rachel._id);
        assert.equal(rachel.name, 'Rachel McAdams');
        assert.isOk(emma._id);
        assert.equal(emma.name, 'Emma Thompson');
    });

   
    it('returns an actor on GET', () => {
        return request
            .get(`/api/actors/${tom._id}`)
            .then(checkOk)
            .then(({ body }) => {
                tom.films = [{
                    _id: banks._id,
                    title: banks.title,
                    released: banks.released
                }];
                assert.deepEqual(body, tom);
            });
    });

    it('returns all actors on GET', () => {
        return request
            .get('/api/actors')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [
                    makeSimple(tom),
                    makeSimple(rachel),
                    makeSimple(emma)
                ]);
            });
    });

    it('updates an actor', () => {
        tom.pob = 'Los Angeles, CA';
        return request
            .put(`/api/actors/${tom._id}`)
            .send(tom)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                delete tom.films;
                assert.deepEqual(body, tom);
            });
    });

    it('DOES NOT remove an actor if they exist as a property of a film', () => {
        return request
            .delete(`/api/actors/${tom._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isFalse(body.removed);
            });
    });

    it('deletes an actor', () => {
        return request
            .del(`/api/films/${banks._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
                return request
                    .del(`/api/actors/${tom._id}`);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
            });
    });
});
const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { Types } = require('mongoose');
const { checkOk, save, saveWithAuth, makeSimple } = request;

describe('Actors API', () => {

    beforeEach(() => dropDatabase());

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

    let banks;
    beforeEach(() => {
        const data = {
            title: 'Saving Mr. Banks',
            studio: Types.ObjectId(),
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

    it('saves an actor', () => {
        assert.isOk(tom._id);
        assert.equal(tom.name, 'Tom Hanks');
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
                    makeSimple(emma)
                ]);
            });
    });

    it('updates an actor', () => {
        tom.pob = 'Los Angeles, CA';
        return request
            .put(`/api/actors/${tom._id}`)
            .set('Authorization', token)
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
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.isFalse(body.removed);
            });
    });

    it('deletes an actor', () => {
        return request
            .del(`/api/films/${banks._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
                return request
                    .del(`/api/actors/${tom._id}`)
                    .set('Authorization', token);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
            });
    });
});
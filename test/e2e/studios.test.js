const { assert } = require('chai');
const request = require('./request');
const { dropDatabase } = require('./_db');
const { checkOk, save, saveWithAuth, makeSimple } = request;

describe.only('Studios API', () => {

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
            });
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
            cast: []
        };
        return save(data, 'films')
            .then(body => banks = body);
    });

    it('saves a studio', () => {
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
                delete disney.address;
                delete disney.films;
                assert.deepEqual(body, [disney]);
            });
    });

    it('DOES NOT remove a studio if it exists as a property of a film', () => {
        return request
            .delete(`/api/studios/${disney._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.isFalse(body.removed);
            });
    });

    it('Removes a studio on DELETE', () => {
        return request
            .delete(`/api/films/${banks._id}`)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
                return request
                    .delete(`/api/studios/${disney._id}`)
                    .set('Authorization', token);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isTrue(body.removed);
            });
    });
    
});
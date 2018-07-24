const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;
const { saveActor, saveFilm, saveStudio, makeStudio } = require('./_helpers');

describe('Studios API', () => {

    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('actors'));
 
    let univision;
    beforeEach(() => {
        return saveStudio({
            name: 'Univision',
            address: {
                city: 'Portland',
                state: 'Oregon',
                country: 'USA'
            }
        })
            .then(data => {
                univision = data;
            });
    });

    let pacino; 
    beforeEach(() => {
        return saveActor({
            name: 'Al Pacino'
        })
            .then(data => {
                pacino = data;
            });       
    });

    let dogDay;
    beforeEach(() => {
        return saveFilm({
            title: 'Dog Day',
            studio: univision._id,
            released: 1990,
            cast: [{
                actor: pacino._id
            }]
        })
            .then(data => {
                dogDay = data;
            });
    });



    it('Saves a studio', () => {
        assert.isOk(univision._id);
    });

    it('Gets a list of studios', () => {
        let fox;
        return saveStudio({
            name: 'Fox',
            
        })
            .then(_fox => {
                fox = _fox;
                return request.get('/api/studios');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body[0].name, univision.name);
                assert.deepEqual(body[1].name, fox.name);
            });
    });

    it('Gets a studio by id', () => {
        return request
            .get(`/api/studios/${univision._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, makeStudio(univision, dogDay));
            });
    });

    it('Does not delete a studio when films exist', () => {
        return request
            .delete(`/api/studios/${univision._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: false });
            });
    });

    it('Deletes a studio by id', () => {
        return request
            .delete(`/api/films/${dogDay._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
                return request.delete(`/api/studios/${univision._id}`);
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
            });
    });
});
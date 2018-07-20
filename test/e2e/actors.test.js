const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Actor API', () => {

    beforeEach(() => dropCollection('actors'));

    function save(actor) {
        return request
            .post('/api/actors')
            .send(actor)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let actor;

    beforeEach(() => {
        return save({
            name: 'Easton',
            dob: new Date(1990, 10, 19),
            pob: 'Phoenix'

        })
            .then(data => {
                actor = data;
            });
    });

    it('saves a actor', () => {
        assert.isOk(actor._id);
    });

    it('gets all actors', () => {
        let mark;
        return save({ name: 'Mark' })
            .then(_mark => {
                mark = _mark;
                return request.get('/api/actors');  
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [actor, mark]);
            });
    });

    it('gets a actor by id', () => {
        return request
            .get(`/api/actors/${actor._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, actor);
            });
    });

    it('updates an actor', () => {
        actor.name = 'Injoong';
        return request 
            .put(`/api/actors/${actor._id}`)
            .send(actor)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, actor);
            });
    });
});
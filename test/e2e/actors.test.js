const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Actor API', () => {

    beforeEach(() => {
        dropCollection('reviews');
        dropCollection('reviewers');
        dropCollection('actors');
        dropCollection('films');
        dropCollection('studios');
    });

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
            .then(data => actor = data);
    });

    let studio;
    beforeEach(() => {
        return request  
            .post('/api/studios')
            .send({ name: 'SortaGood Pictures' })
            .then(({ body }) => studio = body);
    });

    let film;
    beforeEach(() => {
        return request
            .post('/api/films')
            .send({
                title: 'Return of Injoong',
                studio: studio._id,
                released: 2017,
                cast: [{
                    role: '',
                    actor: actor._id
                }]
            })
            .then(({ body }) => film = body);
    });

    it('saves an actor', () => {
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

    const makeSimple = (actor, film) => {
        const simple = {
            _id: actor._id,
            name: actor.name,
            dob: actor.dob,
            pob: actor.pob
        };
        if(film){
            simple.films = [{
                _id: film._id,
                title: film.title,
                released: film.released
            }];
        }
        return simple;
    };

    it('gets an actor by id', () => {
        return request
            .get(`/api/actors/${actor._id}`)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                assert.deepEqual(body, makeSimple(actor, film));
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

    it('removes an actor', () => {
        let mario;
        return save({ name: 'Mario' })
            .then(data => mario = data)
            .then(() => {
                return request
                    .delete(`/api/actors/${mario._id}`)
                    .then(checkOk)
                    .then(res => {
                        assert.deepEqual(res.body, { removed: true });
                        return request.get('/api/actors');
                    })
                    .then(checkOk)
                    .then(({ body }) => {
                        assert.deepEqual(body, [actor]);
                    });

            });

    });
});
const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;
const { saveActor, saveFilm, saveStudio } = require('./helpers');

describe.only('Actor API', () => {

    beforeEach(() => {
        dropCollection('reviews');
        dropCollection('reviewers');
        dropCollection('actors');
        dropCollection('films');
        dropCollection('studios');
    });

    let adminCheck;
    beforeEach(() => {
        let data = {
            name: 'Mariah',
            company: 'ReviewIt, Inc.',
            email: 'mariah@example.com',
            password: 'abc123',
            roles: ['admin']
        };
        return request
            .post('/api/auth/signup')
            .send(data)
            .then(checkOk)
            .then(({ body }) => {
                adminCheck = body.adminCheck;
            });
    });

    let easton;
    beforeEach(() => {
        return saveActor({
            name: 'Easton',
            dob: new Date(1990, 10, 19),
            pob: 'Phoenix'

        })
            .then(data => easton = data);
    });
    ///// TEST ////
    it('saves an actor', () => {
        assert.isOk(easton._id);
    });


    //// END TEST ///
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
                    actor: easton._id
                }]
            })
            .then(({ body }) => film = body);
    });

   
    ///// TEST ////
    it('gets all actors', () => {
        let mark;
        return save({ name: 'Mark' })
            .then(_mark => {
                mark = _mark;
                return request.get('/api/actors');  
            })
            .then(checkOk)
            
            .then(({ body }) => {
                
                assert.deepEqual(body, [easton, mark]);
            });
    });
    //// END TEST ///
    const makeSimple = (easton, film) => {
        const simple = {
            _id: easton._id,
            name: easton.name,
            dob: easton.dob,
            pob: easton.pob
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
    
    ///// TEST ////
    it('gets an actor by id', () => {
        return request
            .get(`/api/actors/${easton._id}`)
            .then(checkOk)
            .then(({ body }) => {
                delete body.__v;
                assert.deepEqual(body, makeSimple(easton, film));
            });
    });
    ///// TEST ////
    it('updates an actor', () => {
        easton.name = 'Injoong';
        return request 
            .put(`/api/actors/${easton._id}`)
            .send(easton)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, easton);
            });
    });
    ///// TEST ////
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
                        assert.deepEqual(body, [easton]);
                    });

            });

    });
});

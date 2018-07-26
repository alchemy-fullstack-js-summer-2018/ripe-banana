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

    let token;
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
                token = body.token;
            });
    });
    /// CREATE AN ACTOR ///
    let easton;
    beforeEach(() => {
        return saveActor({
            name: 'Easton',
            dob: new Date(1990, 10, 19),
            pob: 'Phoenix'

        },
        token
        )
            .then(data => easton = data);
    });

    ///// TEST ////
    it('saves an actor', () => {
        assert.isOk(easton._id);
    });


    //// CREATE A STUDIO ///
    let alchemy;
    beforeEach(() => {
        return saveStudio({
            name: 'Alchemy Pictures',
            address: {
                city: 'Portland',
                state: 'OR',
                country: 'USA'
            }
        },
        token
        )
            .then(data => {
                alchemy = data;
            });
    });

    /// CREATE A FILM ///
    let film;
    beforeEach(() => {
        return saveFilm({
            title: 'Return of Injoong',
            studio: alchemy._id,
            released: 2017,
            cast: [{
                actor: easton._id
            }]
        },
        token
        )
            .then(body => {
                console.log(body);
                film = body;
            });
            
    });

   
    ///// TEST ////
    it('gets all actors', () => {
        let mark;
        return saveActor(
            { 
                name: 'Mark',
                dob: '1966',
                pob: 'NJ'
            
            },
            token
        )
            .then(_mark => {
                mark = _mark;
                return request.get('/api/actors');  
            })
            .then(checkOk)
            
            .then(({ body }) => {
                delete body.__v;
                assert.deepEqual(body[0].name, easton.name);
                assert.deepEqual(body[1].name, mark.name);

            });
    });
    //// END TEST ///
    
    const makeSimpleActor = (easton, film) => {
        const simple = {
            _id: easton._id,
            name: easton.name,
            dob: easton.dob,
            pob: easton.pob
        };
        if(film){
            simple.films = [{
                _id: film._id,
                released: film.released,
                title: film.title
                
            }];
        }
        return simple;
    };
    ///// TEST ////
    it.only('gets an actor by id', () => {
        return request
            .get(`/api/actors/${easton._id}`)
            .then(({ body }) => {
                delete body.__v;
                console.log(body);
                console.log(makeSimpleActor(easton, film));
                assert.deepEqual(body, makeSimpleActor(easton, film));
            });
    });
    
    
    ///// TEST ////
    it('updates an actor', () => {
        easton.name = 'Injoong';
        return request 
            .put(`/api/actors/${easton._id}`)
            .set('Authorization', token)
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

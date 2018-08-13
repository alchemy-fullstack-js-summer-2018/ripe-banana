const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Films API', () => {

    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('actors'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('reviews'));

    function save(film) {
        return request
            .post('/api/films')
            .send(film)
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let film; 
    let foster; 
    let warner; 
    let token;
    beforeEach(() => dropCollection('reviewers'));
    
    beforeEach(() => {
        return signup(
            {
                name: 'Betty Crocker',
                email: 'crock@email.com',
                company: 'Pancake Hut',
                password: 'abc12345',
                roles: ['admin']
            })
            
            .then(body => {
                token = body.token;
            });
            
    });
    function signup(reviewer) {
        return request
            .post('/api/reviewers/signup')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }
        
        
    it('signs up and saves a reviewer', () => {
        assert.isOk(token);
    });
        
    it('can sign in a reviewer', () => {
        return request
            .post('/api/reviewers/signin')
            .send({
                email: 'crock@email.com',
                password: 'abc12345'
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.isDefined(body.token);
            });
    });
        
    it('checks token', () => {
        return request
            .get('/api/reviewers/verify')
            .set('Authorization', token)
            .then(checkOk);
    });
        
    function saveStudio(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }
        
    beforeEach(() => {
        return saveStudio({ name: 'Warner Bros.' })
            .then(data => {
                warner = data;
            });
    });
     
    function saveActor(actor) {
        return request
            .post('/api/actors')
            .send(actor)
            .then(checkOk)
            .then(({ body }) => body);
    }    
    beforeEach(() => {
        return saveActor({ name: 'Jodi Foster' })
            .then(data => {
                foster = data;
            });
    });
        
    
    beforeEach(() => {
        return save({ 
            title: 'Contact',
            studio: warner._id,
            released: 1997,
            cast: [{
                role: 'Dr. Eleanor "Ellie" Arroway',
                actor: foster._id
            }]
        })
            .then(data => {
                film = data;
            });
    });
        
    it('saves a film', () => {
        assert.isOk(film._id);
    });
        
    const makeSimple = (film, studio) => {
        const simple = {
            _id: film._id,
            title: film.title,
            released: film.released,
        };
        if(studio){
            simple.studio = {
                _id: studio._id,
                name: studio.name
            };
        }
        return simple;
    };
        
    it('gets all films', () => {
        let myMovie;
        return save({
            title: 'Silence of the Lambs',
            studio: warner._id,
            released: 1991,
            cast: [{
                role: 'Clarice Starling',
                actor: foster._id
            }]
        }) 
            .then(_myMovie => {
                myMovie = _myMovie;
                return request.get('/api/films');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [
                    makeSimple(film, warner),
                    makeSimple(myMovie, warner)
                ]);
            });
    });
        
    it('gets a film by id', () => {
        return request
            .get(`/api/films/${film._id}`)
            .then(checkOk)
            .then (({ body }) => {
                assert.deepEqual(body, {
                    _id: film._id,
                    title: film.title,
                    studio: {
                        _id: warner._id,
                        name: warner.name,
                    },
                    released: film.released,
                    cast: [{
                        _id: film.cast[0]._id,
                        role: film.cast[0].role,
                        actor: { 
                            _id: foster._id,
                            name: foster.name  
                        }
                    }],
                    reviews: []
                    
                });
            });
    });
});
    
const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Films API', () => {

    beforeEach(() => dropCollection('films'));

    function save(film) {
        return request
            .post('/api/films')
            .send(film)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let studio;
    beforeEach(() => {
        return request  
            .post('/api/studios')
            .send({ name: 'SortaGood Pictures' })
            .then(({ body }) => studio = body);
    });

    let actor;
    beforeEach(() => {
        return request
            .post('/api/actors')
            .send({ name: 'Arthur' })
            .then(({ body }) => actor = body);
    });

    let film;

    beforeEach(() => {
        return save({
            title: 'Injoong Strikes Back',
            studio: studio._id,
            released: 2018,
            cast: [{
                role: 'Mr. Yoon',
                actor: actor._id
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
            released: film.released
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
        let bmovie;
        return save({ 
            title: 'B Movie film',
            studio: studio._id,
            released: 2018
        })
            .then(_bmovie => {
                bmovie = _bmovie;
                return request.get('/api/films');  
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [
                    makeSimple(film, studio),
                    makeSimple(bmovie, studio)
                ]);
            });
    });

    it('gets a film by id', () => {
        return request
            .get(`/api/films/${film._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, film);
            });
    });
});
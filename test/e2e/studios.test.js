const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Studio API', () => {

    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('reviewers'));

    function save(studio) {
        return request
            .post('/api/studios')
            .set('Authorization', token)
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let token;
    beforeEach(() => {
        return request
            .post('/api/reviewers/signup')
            .send({ 
                name: 'Marty',
                company: 'ACL',
                email: 'marty@portland.com',
                password: 'marty',
                roles: ['admin']
            })
            .then(({ body }) => token = body.token);
    });

    let studio;
    beforeEach(() => {
        return save({
            name: 'The Kick Ass Studio',
            address: {
                city: 'Portland',
                state: 'Oregon',
                country: 'USA'
            }
        })
            .then(data => studio = data);
    });

    let film;
    beforeEach(() => {
        return request
            .post('/api/films')
            .set('Authorization', token)
            .send({
                title: 'Return of Injoong',
                studio: studio._id,
                released: 2017
            })    
            .then(({ body }) => {
                film = body;
            });
    });

    const makeSimple = (studio) => {
        const simple = {
            _id: studio._id,
            name: studio.name
        };
        return simple;
    };

    const makeSimpleTwo = (studio) => {
        const simple = {
            _id: studio._id,
            name: studio.name,
            address: studio.address
        };

        if(film){
            simple.films = [{
                _id: film._id,
                title: film.title
            }];
        }
        return simple;
    };

    it('saves a studio', () => {
        assert.isOk(studio._id);
    });

    it('gets all studios', () => {
        let bmovie;
        return save({ name: 'B Movie Studio' })
            .then(_bmovie => {
                bmovie = _bmovie;
                return request.get('/api/studios');  
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [
                    makeSimple(studio),
                    makeSimple(bmovie)
                ]);
            });
    });

    it('gets a studio by id', () => {
        return request
            .get(`/api/studios/${studio._id}`)
            .then(({ body }) => {
                delete body.__v;
                assert.deepEqual(body, makeSimpleTwo(studio));  
            });
    });

    it('removes a studio', () => {
        let acl;
        return save({ name: 'ACL Studio' })
            .then(data => acl = data)
            .then(() => {
                return request
                    .delete(`/api/studios/${acl._id}`)
                    .set('Authorization', token)
                    .then(checkOk)
                    .then(res => {
                        assert.deepEqual(res.body, { removed: true });
                        return request.get('/api/studios');
                    })
                    .then(checkOk)
                    .then(({ body }) => {
                        assert.deepEqual(body, [makeSimple(studio)]);
                    });
            });
    });
});
const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Studios API', () => {

    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('films'));

    function saveStudio(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let studio;

    beforeEach(() => {
        return saveStudio({ 
            name: 'Kittensgate',
            address: { 
                city: 'Portland',
                state: 'OR',
                country: 'USA'
            }
        })
            .then(data => {
                studio = data;
            });
    });
    
    let film;
    
    beforeEach(() => {
        return request
            .post('/api/films')
            .send({
                title: 'Glitter',
                studio: studio._id,
                released: 2001
            })
            .then(({ body }) => {
                film = body;
            });
    });

    it('saves a film', () => {
        assert.isOk(film._id);
    });
    
    it('saves a studio', () => {
        assert.isOk(studio._id);
    });

    const makeSimple = (studio) => {
        const simple = {
            _id: studio._id,
            name: studio.name
        };
        return simple;
    };
    
    it('gets a list of studios', () => {
        let mgm;
        return saveStudio({ name: 'MGM' })
            .then(_mgm => {
                mgm = _mgm;
                return request.get('/api/studios');
            })
            .then(checkOk)
            .then(({ body }) => {

                assert.deepEqual(body, [makeSimple(studio), makeSimple(mgm)]);
            
            });
    });
    
    it('gets a studio by id', () => {
        return request
            .get(`/api/studios/${studio._id}`)
            .then(({ body }) => {
                delete body._v;
                assert.deepEqual(body, (studio));

            });
    });

    it('deletes a studio', () => {
        let universal;
        return saveStudio({ name: 'Universal' })
            .then(data => universal = data)
            .then(() => {
                return request
                    .delete(`/api/studios/${universal._id}`)
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
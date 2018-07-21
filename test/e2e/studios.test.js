const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Studio API', () => {

    beforeEach(() => dropCollection('studios'));

    function save(studio) {
        return request
            .post('/api/studios')
            .send(studio)
            .then(checkOk)
            .then(({ body }) => body);
    }

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
            .then(data => {
                studio = data;
            });
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

    it.skip('gets a studio by id', () => {
        return request
            .get(`/api/studios/${studio._id}`)
            .then(({ body }) => {
                console.log('STUDIO BY ID', body);
                assert.deepEqual(body, studio);
            });
    });
});
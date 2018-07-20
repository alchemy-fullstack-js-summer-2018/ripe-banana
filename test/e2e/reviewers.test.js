const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe('Reviewers API', () => {

    beforeEach(() => dropCollection('reviewers'));

    function save(reviewer) {
        return request
            .post('/api/reviewers')
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body); 
    }

    let justinChang;
    beforeEach(() => {
        return save({
            name: 'Justin Chang',
            company: 'The Hollywood Reporter' 
        })
            .then(data => {
                justinChang = data;
            });
    });

    it('saves a reviewer', ()=> {
        assert.isOk(justinChang._id);
    });

    it('gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${justinChang._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, justinChang);
            });
    });

    it('gets a list of reviewers', () => {
        let injoong;
        return save({
            name: 'Injoong Yoon',
            company: 'Variety' 
        })
            .then(_injoong => {
                injoong = _injoong;
                return request.get('/api/reviewers');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [justinChang, injoong]);

            });
    });
});
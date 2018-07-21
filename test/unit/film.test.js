const { assert } = require('chai');
const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Film = require('../../lib/models/film');
// const Actor = require('../../lib/models/actor');
// const Studio = require('../../lib/models/studio');

describe('Film model', () => {
    
    it('validates good model', () => {
        const data = {
            title: 'Inception',
            studio: Types.ObjectId(),
            released: 2010,
            cast: [{
                role: 'Cobb',
                actor: Types.ObjectId()
            }]
        };
        const film = new Film(data);
        const json = film.toJSON();
        delete json._id;
        delete json.cast[0]._id;
        assert.deepEqual(json, data);
    });

    it('validates required fields', () => {
        const film = new Film({});
        const errors = getErrors(film.validateSync(), 3);
        assert.equal(errors.title.kind, 'required');
        assert.equal(errors.studio.kind, 'required');
        assert.equal(errors.released.kind, 'required');
    });
});
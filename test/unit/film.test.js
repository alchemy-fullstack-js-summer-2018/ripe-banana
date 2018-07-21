const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Film = require('../../lib/models/film');
const { Types } = require('mongoose');

describe('Film model', () => {
    
    it('validates a good model', () => {
        const data = {
            title: 'Bobby\'s Unemployment',
            studio: Types.ObjectId(),
            released: 2018,
            cast: [{
                role: 'Bobby',
                actor: Types.ObjectId()
            }]
        };

        const film = new Film(data);
        const json = film.toJSON();
        delete json._id;
        json.cast.forEach(c => delete c._id);
        assert.deepEqual(json, data);
        assert.isUndefined(film.validateSync());
    });

    it('validates that a title, studio, released and actor is required', () => {
        const film = new Film({
            cast: [{
                role: 'Being homeless'
            }]
        });

        const errors = getErrors(film.validateSync(), 4);
        
        assert.equal(errors.title.kind, 'required');
        assert.equal(errors.studio.kind, 'required');
        assert.equal(errors.released.kind, 'required');
        assert.equal(errors['cast.0.actor'].kind, 'required');
        
    });
});
const { assert } = require('chai');
const { getErrors } = require('./helpers');
const { Types } = require('mongoose');
const Film = require('../../lib/models/film');

describe('Film model', () => {

    it('validates good model', () => {
        const data = {
            title: 'Dracula',
            studio: Types.ObjectId(),
            released: 1992,
            cast: [{
                role: 'Mina Harker',
                actor: Types.ObjectId()
            }]
        };

        const film = new Film(data);

        const json = film.toJSON();
        delete json._id;
        json.cast.forEach(a => delete a._id);
        assert.isUndefined(film.validateSync());
        assert.deepEqual(json, data);
    });

    it('validates all required fields', () => {
        const film = new Film({});
        const errors = getErrors(film.validateSync(), 3);
        assert.equal(errors.title.kind, 'required');
        assert.equal(errors.studio.kind, 'required');
        assert.equal(errors.released.kind, 'required');
    });

    it('validates actor id', () => {
        const film = new Film({
            title: 'Dracula',
            studio: Types.ObjectId(),
            released: 1992,
            cast: [{
                role: 'Mina Harker'
            }]
        });
        const errors = getErrors(film.validateSync(), 1);
        assert.equal(errors['cast.0.actor'].kind, 'required');
    });
});
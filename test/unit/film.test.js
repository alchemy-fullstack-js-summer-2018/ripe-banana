const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Film = require('../../lib/models/film');
const { Types } = require('mongoose');

describe('Film model', () => {

    it('validates a dope FILM model', () => {
        const data = {
            title: 'Contact',
            studio: Types.ObjectId(),
            //'Warner Bros.',
            released: 1997,
            cast: [{
                role: 'Dr. Eleanor "Ellie" Arroway',
                actor: Types.ObjectId()
                // Jodie Foster   
            }]
        };

        const film = new Film(data);
        const json = film.toJSON();
        delete json._id;
        json.cast.forEach(c => delete c._id);
        assert.deepEqual(json, data);
        //assert.isUndefined(film.validateSync());
    });

    it('validates required fields', () => {
        const film = new Film({});
        const errors = getErrors(film.validateSync(), 3);
        assert.equal(errors.title.kind, 'required', 'title');
        assert.equal(errors.studio.kind, 'required', 'studio');
        assert.equal(errors.released.kind, 'required', 'released');
    });
});
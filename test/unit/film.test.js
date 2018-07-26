const chai = require('chai');
const { assert } = chai;
const Film = require('../../lib/models/film');
const { getErrors } = require('./helpers');
const { Types } = require('mongoose');

describe('Film model', () => {

    it('validates good model', () => {
        const data = {
            title: 'Saving Mr. Banks',
            studio: Types.ObjectId(),
            released: 2013,
            cast: [{
                role: 'Walt Disney',
                actor: Types.ObjectId()
            }]
        };
        const film = new Film(data);
        const json = film.toJSON();
        delete json._id;
        json.cast.forEach(a => delete a._id);
        assert.deepEqual(json, data);
        assert.isUndefined(film.validateSync());
    });

    it('validates required fields', () => {
        const film = new Film({});
        const errors = getErrors(film.validateSync(), 3);
        assert.equal(errors.title.kind, 'required', 'title');
        assert.equal(errors.studio.kind, 'required', 'studio');
        assert.equal(errors.released.kind, 'required', 'released');
    });

    it('validates required actor ID', () => {
        const film = new Film({
            title: 'Saving Mr. Banks',
            studio: Types.ObjectId(),
            released: 2013,
            cast: [{
                role: 'Walt Disney'
            }]
        });
        const errors = getErrors(film.validateSync(), 1);
        assert.equal(errors['cast.0.actor'].kind, 'required');
    });

    it('validates valid year', () => {
        const film = new Film({
            title: 'Saving Mr. Banks',
            studio: Types.ObjectId(),
            released: 201,
            cast: []
        });
        const errors = getErrors(film.validateSync(), 1);
        assert.equal(errors.released.kind, 'user defined');
        assert.equal(errors.released.message, 'Must be a valid year');
    });
});
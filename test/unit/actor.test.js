const chai = require('chai');
const { assert } = chai;
const Actor = require('../../lib/models/actor');
const { getErrors } = require('./helpers');

describe('Actor model', () => {

    it('validates good model', () => {
        const data = {
            name: 'Tom Hanks',
            dob: new Date(1956, 6, 9),
            pob: 'Concord, CA'
        };
        const actor = new Actor(data);

        const json = actor.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(actor.validateSync());
    });

    it('validates required name', () => {
        const actor = new Actor({});
        const errors = getErrors(actor.validateSync(), 1);
        assert.equal(errors.name.kind, 'required');
    });

});
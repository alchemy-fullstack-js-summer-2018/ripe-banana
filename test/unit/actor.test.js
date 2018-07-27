const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Actor = require('../../lib/models/actor');

describe('Actor model', () => {

    it('validates a good model', () => {
        const data = {
            name: 'Winona Ryder',
            dob: new Date(1971, 9, 29),
            pob: 'MN'
        };

        const actor = new Actor(data);
        const json = actor.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(actor.validateSync());
    });

    it('actor name is required', () => {
        const actor = new Actor({});
        const errors = getErrors(actor.validateSync(), 1); 
        assert.equal(errors.name.kind, 'required');
    });
});
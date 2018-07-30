const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Actor = require('../../lib/models/actor');

describe('Actor Model', () => {

    it('validates good model', () => {
        const data = {
            name: 'Brad Pitt',
            dob: new Date(),
            pob: 'Burbank' 
        };
     
        const actor = new Actor(data);

        const json = actor.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
    });

    it('validates that name is required', () => {
        const actor = new Actor({});

        const errors = getErrors(actor.validateSync(), 1);
        assert.equal(errors.name.kind, 'required');
    });
});
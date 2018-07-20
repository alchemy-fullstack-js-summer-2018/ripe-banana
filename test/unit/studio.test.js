const { assert } = require('chai');
// const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Studio = require('../../lib/models/studio');

describe('Studio model', () => {

    it('validates good model', () => {
        const data = {
            name: 'Universal Studios',
            address: {
                city: 'Burbank',
                state: 'CA',
                country: 'USA'
            }
        };
     
        const studio = new Studio(data);

        const json = studio.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
    });

    it('validates that name is required', () => {
        const studio = new Studio({});
        const errors = getErrors(studio.validateSync(), 1);
        assert.equal(errors.name.kind, 'required');
    });
});


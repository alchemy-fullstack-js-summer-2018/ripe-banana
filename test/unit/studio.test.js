const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Studio = require('../../lib/models/studio');

describe('Studio model', () => {
    
    it('validates a good model', () => {
        const data = {
            name: 'Alchemy Century Fox',
            address: {
                city: 'Portland',
                state: 'Oregon',
                country: 'USA'
            }
        };

        const studio = new Studio(data);
        const json = studio.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(studio.validateSync());
    });
});
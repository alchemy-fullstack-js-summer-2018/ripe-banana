const { assert } = require('chai');
const Actor = require('../../lib/models/actor');

describe('Actor model', () => {

    it('validates good model', () => {
        const data = {
            name: 'Chuck Norris',
            dob: new Date (1940, 3, 10),
            pob: 'Ryan, OK'
        };
        
        const actor = new Actor(data);

        const json = actor.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(actor.validateSync());

    });
});
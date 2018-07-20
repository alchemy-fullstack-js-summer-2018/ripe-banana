const { assert } = require('chai');
// const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Reviewer = require('../../lib/models/reviewer');

describe('Reviewer Model', () => {

    it('validates good model', () => {
        const data = {
            name: 'Brad Pitt',
            dob: new Date(),
            pob: 'Burbank' 
        };
     
        const reviewer = new Reviewer(data);

        const json = reviewer.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
    });

    it('validates that name is required', () => {
        const reviewer = new Reviewer({});

        const errors = getErrors(reviewer.validateSync(), 1);
        assert.equal(errors.name.kind, 'required');
    });
});
const { assert } = require('chai');
// const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Reviewer = require('../../lib/models/reviewer');

describe('Reviewer Model', () => {

    it('validates good model', () => {
        const data = {
            name: 'Justin Chang',
            company: 'The Hollywood Reporter' 
        };
     
        const reviewer = new Reviewer(data);

        const json = reviewer.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
    });

    it('validates that all fields are required', () => {
        const reviewer = new Reviewer({});
        const errors = getErrors(reviewer.validateSync(), 2);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
    });
});
const chai = require('chai');
const { assert } = chai;
const Reviewer = require('../../lib/models/reviewer');
const { getErrors } = require('./helpers');

describe('Reviewer model', () => {

    it('validates good model', () => {
        const data = {
            name: 'Arthur Jen',
            company: 'Alchemy Movie Lab'
        };
        const reviewer = new Reviewer(data);

        const json = reviewer.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(reviewer.validateSync());
    });

    it('validates required name and company', () => {
        const reviewer = new Reviewer({});
        const errors = getErrors(reviewer.validateSync(), 2);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
    });

});
const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Reviewer = require('../../lib/models/reviewer');

describe('Reviewer model', () => {
    
    it('validates a good model', () => {
        const data = {
            name: 'Bobby',
            company: 'Unemployed',
            email: 'example@example.com',
            roles: ['admin'],
            hash: '09870987'
        };

        const reviewer = new Reviewer(data);
        const json = reviewer.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(reviewer.validateSync());
    });

    it('validates that a name and company is required', () => {
        const reviewer = new Reviewer({});
        const errors = getErrors(reviewer.validateSync(), 4);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
        assert.equal(errors.email.kind, 'required');
        assert.equal(errors.hash.kind, 'required');
    });
});
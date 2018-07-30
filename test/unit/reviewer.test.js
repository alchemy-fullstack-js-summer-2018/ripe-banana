const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Reviewer = require('../../lib/models/reviewer');

describe('Reviewer Model', () => {

    it('validates good model', () => {
        const data = {
            name: 'Justin Chang',
            company: 'The Hollywood Reporter',
            email: 'justin@.email.com',
            password: 'pwd123',
            roles: []
        };
     
        const reviewer = new Reviewer(data);

        assert.equal(reviewer.email, data.email);
        assert.isUndefined(reviewer.password, 'password should not be set');

        reviewer.generateHash(data.password);
        assert.isDefined(reviewer.hash, 'hash is defined');
        assert.notEqual(reviewer.hash, data.password, 'hash not same as password');

        assert.isUndefined(reviewer.validateSync());

        assert.isTrue(reviewer.comparePassword(data.password), 'compare good password');
        assert.isFalse(reviewer.comparePassword('bad password'), 'compare bad password');

    });

    it('validates that all fields are required', () => {
        const reviewer = new Reviewer({});
        const errors = getErrors(reviewer.validateSync(), 4);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
        assert.equal(errors.email.kind, 'required');
        assert.equal(errors.hash.kind, 'required');

    });
});
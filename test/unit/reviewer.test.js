const { assert } = require('chai');
// const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Reviewer = require('../../lib/models/reviewer');

describe('Reviewer Model', () => {

    it.only('validates good model', () => {
        const data = {
            name: 'Justin Chang',
            company: 'The Hollywood Reporter',
            email: 'email@.email.com',
            password: 'pwd123',
            roles: []
        };
     
        const reviewer = new Reviewer(data);

        // const json = reviewer.toJSON();
        // delete json._id;
        // assert.deepEqual(json, data);
        assert.equal(reviewer.email, data.email);
        assert.isUndefined(reviewer.password, 'password should not be set');

        reviewer.generateHash(data.password);
        assert.isDefined(reviewer.hash, 'hash is defined');
        assert.notEqual(reviewer.hash, data.password, 'hash not same as password');

    });

    it('validates that all fields are required', () => {
        const reviewer = new Reviewer({});
        const errors = getErrors(reviewer.validateSync(), 2);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
    });
});
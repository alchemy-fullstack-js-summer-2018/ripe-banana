const { assert } = require('chai');
// const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const User = require('../../lib/models/user');

describe.only('User Model', () => {

    it('validates initial model', () => {
        const data = {
            email: 'jchang@variety.com',
            password: 'ilurrrvmoviez',
            roles: [] 
        };
     
        const user = new User(data);
        assert.equal(user.email, data.email);
        assert.isUndefined(user.password);
    });

    xit('validates that all fields are required', () => {
        const user = new User({});
        const errors = getErrors(user.validateSync(), 2);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
    });
});
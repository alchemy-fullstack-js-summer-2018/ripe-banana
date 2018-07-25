const { assert } = require('chai');
// const { Types } = require('mongoose');
// const { getErrors } = require('./helpers');
const User = require('../../lib/models/user');

const data = {
    email: 'jchang@variety.com',
    password: 'ilurrrvmoviez',
    roles: [] 
};

describe.only('User Model', () => {

    it('validates initial model', () => {
        const user = new User(data);
        assert.equal(user.email, data.email);
        assert.isUndefined(user.password);
    });

    it('generates and validates correct hash and password', () => {
        const user = new User(data);
        user.generateHash(data.password);
        assert.isDefined(user.hash);
        assert.notEqual(user.hash, data.password);
        assert.isUndefined(user.validateSync());

        assert.isTrue(user.comparePassword(data.password));
        assert.isFalse(user.comparePassword('badpassword'));
    });
});
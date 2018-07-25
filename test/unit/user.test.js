const { assert } = require('chai');
// const { Types } = require('mongoose');
// const { getErrors } = require('./helpers');
const User = require('../../lib/models/user');

describe.only('User Model', () => {

    it('validates good model', () => {
        const data = {
            email: 'hello@email.com',
            password: 'The Hollywood Reporter',
            roles: []
        };
     
        const user = new User(data);
        assert.equal(user.email, data.email);
        assert.isUndefined(user.password, 'password shouldnt be here');

        user.generateHash(data.password);
        assert.isDefined(user.hash, 'hash is defined');
        assert.notEqual(user.hash, data.password, 'hash not defined');

        assert.isUndefined(user.validateSync());

        assert.isTrue(user.comparePassword(data.password), 'compare a good pass');
        assert.isFalse(user.comparePassword('not the password'), 'compare bad pass');
    });
});
const { assert } = require('chai');
const User = require('../../lib/models/user');
const { getErrors } = require('./helpers');

describe.only('Film model', () => {
    it('validates good user model', () => {
        const data = {
            email: 'marty@martypdx.com',
            password: 'abc123'
        };
        const user = new User(data);
        assert.equal(user.email, data.email);
        assert.isUndefined(user.password);

        user.generateHash(data.password);
        assert.isDefined(user.hash);
        assert.notEqual(user.hash, data.password);

        assert.isTrue(user.comparePassword(data.password));
        assert.isFalse(user.comparePassword('bad password'));
    });
});
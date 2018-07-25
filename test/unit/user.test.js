const { assert } = require('chai');
const User = require('../../lib/models/user');

describe.only('User model', () => {
    it('Validates good User model', () => {
        const data = {
            email: 'test@test.com',
            password: '123456',
            roles: []
        };

        const user = new User(data);
        assert.equal(user.email, data.email);
        assert.isUndefined(user.password, 'Password should not be set');

        user.generateHash(data.password);
        assert.isDefined(user.hash, 'Hash is defined');
        assert.notEqual(user.hash, data.password, 'Hash not the same as password');

        assert.isUndefined(user.validateSync());
        assert.isTrue(user.comparePassword(data.password), 'Compare good password');
        assert.isFalse(user.comparePassword('bad password'), 'Compare bad password');
    });
});
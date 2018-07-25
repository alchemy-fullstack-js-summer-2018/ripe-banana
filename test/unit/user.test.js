const { assert } = require('chai');
const User = require('../../lib/models/user');
const { Types } = require('mongoose');
const { getErrors } = require('./helpers');

describe.only('User model', () => {
    it('validates good user model', () => {
        const data = {
            email: 'arthur@gmail.com',
            password: 'abc123',
            reviewer: Types.ObjectId(),
            roles: []
        };
        const user = new User(data);
        assert.equal(user.email, data.email);
        assert.isUndefined(user.password);

        user.generateHash(data.password);
        assert.isDefined(user.hash);
        assert.notEqual(user.hash, data.password);

        assert.isUndefined(user.validateSync());
        assert.isTrue(user.comparePassword(data.password));
        assert.isFalse(user.comparePassword('bad password'));
    });

    it('requires email and hash', () => {
        const user = new User({});
        const errors = getErrors(user.validateSync(), 3);
        assert.equal(errors.email.kind, 'required');
        assert.equal(errors.hash.kind, 'required');
        assert.equal(errors.reviewer.kind, 'required');
    });
});
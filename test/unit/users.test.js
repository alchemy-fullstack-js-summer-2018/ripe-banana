const chai = require('chai');
const { assert } = chai;
const User = require('../../lib/models/user');
const { getErrors } = require('./helpers');
const { Types } = require('mongoose');

describe('User model', () => {

    it('validates good user model', () => {
        const data = {
            email: 'test@test.com',
            password: 'abc123',
            reviewer: Types.ObjectId(),
            roles: [] 
        };

        const user = new User(data);
        
        assert.equal(user.email, data.email);
        assert.isUndefined(user.password, 'password should not be set');

        user.generateHash(data.password);
        assert.isDefined(user.hash, 'hash is defined');
        assert.notEqual(user.hash, data.password, 'hash not same as password');

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

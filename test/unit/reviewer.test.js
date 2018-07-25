const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Reviewer = require('../../lib/models/reviewer');

describe.only('Reviewer model', () => {

    it('validates good model', () => {
        const data = {
            name: 'Chip Ellsworth III',
            company: 'Fermented Banana',
            email: 'chip@fermentedbanana.com',
            password: 'abc123',
            roles: []
        };
        const chip = new Reviewer(data);

        const json = chip.toJSON();
        delete json._id;
        assert.equal(chip.email, data.email);
        assert.isUndefined(chip.password, 'password should not be set');

        chip.generateHash(data.password);
        assert.isDefined(chip.hash, 'hash is defined');
        assert.notEqual(chip.hash, data.password, 'hash should not be equal to password');


        assert.isUndefined(chip.validateSync());
        
        assert.isTrue(chip.comparePassword(data.password, 'compare good password'));
        assert.isFalse(chip.comparePassword('bad'));
        delete data.password;
        assert.deepEqual(json, data);
    });

    it('name and company are required', () => {
        const tyrone = new Reviewer({});
        const errors = getErrors(tyrone.validateSync(), 4);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
    });
});
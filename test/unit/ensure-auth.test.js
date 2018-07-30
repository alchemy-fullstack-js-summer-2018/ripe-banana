const { assert } = require('chai');
const createEnsureAuth = require('../../lib/util/ensure-auth');
const tokenService = require('../../lib/util/token-service');
require('dotenv').config();

describe('Ensure auth middleware', () => {
    const user = { _id: 123 };
    let token = '';
    beforeEach(() => {
        return tokenService.sign(user)
            .then(t => token = t);
    });

    const ensureAuth = createEnsureAuth();

    it('adds a payload as req.user on success', done => {
        const req = {
            get(header) {
                if(header === 'Authorization') return token;
            }
        };

        const next = () => {
            assert.equal(req.user.id, user._id);
            done();
        };
        ensureAuth(req, null, next);
    });

    it('calls next with error when token is bad', done => {
        const req = {
            get() { return 'bad-token'; }
        };

        const next = err => {
            assert.equal(err.code, 401);
            done();
        };
        ensureAuth(req, null, next);
    });
});
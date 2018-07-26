const { assert } = require('chai');
const createEnsureAuth = require('../../lib/util/ensure-auth');
const tokenService = require('../../lib/util/token-service');

describe('ensure auth middleware', () => {
    const reviewer = { _id: 123 };
    let token = '';
    beforeEach(() => {
        return tokenService.sign(reviewer)
            .then(t => token = t);
    });

    const ensureAuth = createEnsureAuth();

    it('adds payload as req.reviewer on success', done => {
        const req = {
            get(header) {
                if(header === 'Authorization') return token;
            }
        };

        const next = () => {
            assert.equal(req.reviewer.id, reviewer._id, 'payload is assigned to req as reviewer');
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
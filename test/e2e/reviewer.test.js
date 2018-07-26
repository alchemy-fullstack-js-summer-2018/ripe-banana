const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

describe('Reviewer API', () => {

    beforeEach(() => dropCollection('reviewers'));

    let token;
    let chip;
    beforeEach(() => {
        let data = {
            name: 'Chip Ellsworth III',
            company: 'Fermented Banana',
            email: 'chip@fermentedbanana.com',
            password: 'pw123'
        };

        return request
            .post('/api/reviewers/signup')
            .send(data)
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                chip = body.reviewer;
                console.log('chip', chip);
            }); 
    });

    it('it signs up a reviewer', () => {
        assert.isDefined(token);
    });

    it('signs in a user', () => {
        delete chip._id;
        return request 
            .post('/api/reviewers/signin')
            .send(chip)
            .then(checkOk)
            .then(({ body }) => {
                // console.log('body***', body);
                assert.isDefined(body.token);
            });
    });

    it('verifies a token', () => {
        return request
            .get('/api/reviewers/verify')
            .set('Authorization', token)
            .then(checkOk);
    });

    // it('fails on wrong password', () => {
    //     return request 
    //         .post('/api/reviewers/signin')
    //         .send({
    //             email: 'chip@fermentedbanana.com',
    //             password: 'bad'
    //         })
    //         .then(res => {
    //             console.log('***res***', res.body);
    //             assert.equal(res.status, 401);
    //             assert.equal(res.body.error, 'Invalid email and/or password');
    //         });
    // });

    //     function save(reviewer) {
    //         return request
    //             .post('/api/reviewers')
    //             .send(reviewer)
    //             .then(checkOk)
    //             .then(({ body }) => body);
    //     }

    //     let tyrone;
    //     let chip;

    //     beforeEach(() => {
    //         return save({
    //             name: 'Tyrone Payton',
    //             company: 'Fermented Banana'
    //         })
    //             .then(data => tyrone = data);
    //     });

    //     beforeEach(() => {
    //         return save({
    //             name: 'Chip Ellsworth III',
    //             company: 'Fermented Banana'
    //         })
    //             .then(data => chip = data);
    //     });

    it('saves a reviewer', () => {
        assert.isOk(chip._id);
    });

//     it('gets a reviewer by id', () => {
//         return request
//             .get(`/api/reviewers/${chip._id}`)
//             .then(checkOk)
//             .then(({ body }) => {
//                 assert.deepEqual(body, chip);
//             });
//     });

//     it('gets all reviewers', () => {
//         return request
//             .get('/api/reviewers')
//             .then(checkOk)
//             .then(({ body }) => {
//                 assert.deepEqual(body, [tyrone, chip]);
//             });
//     });

//     it('updates a reviewer', () => {
//         tyrone.company = 'Very Bad Wizards';
//         return request
//             .put(`/api/reviewers/${tyrone._id}`)
//             .send(tyrone)
//             .then(checkOk)
//             .then(() => {
//                 assert.equal(tyrone.company, 'Very Bad Wizards');
//             });
//     });
});
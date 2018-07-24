// const { assert } = require('chai');
// const request = require('./request');
// const { dropCollection } = require('./db');

// const { checkOk } = request;

// let actorBob;
// let studioCool;
// let reviewerSue;
// let filmAlchemy
// let reviewA;
// let reviewB;


// describe('Reviews API', () => {

//     beforeEach(() => dropCollection('reviews'));
//     beforeEach(() => dropCollection('reviewers'));
//     beforeEach(() => dropCollection('films'));

//     function save(review) {
//         return request  
//             .post('/api/reviews')
//             .send(review)
//             .then(checkOk)
//             .then(({ body }) => body);
//     }

// beforeEach(() => {
//     return save({
//         rating: 3,
//         reviewer: Sue,
//         review: 'this is sues review',
//         film: Alchemy
//     })
//     .then(data => {
//         reviewA = data;
//     });
// }
// });
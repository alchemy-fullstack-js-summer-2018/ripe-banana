const { assert } = require('chai');
// const { request, save, checkOk } = require('./request');
const { request, checkOk } = require('./request');
const { dropCollection } = require('./db');

// describe('Reviewers API', () => {

//     beforeEach(() => dropCollection('reviewers'));

//     let token;
//     beforeEach(() => {
//         return request
//             .post('/api/auth/signup')
//             .send({
//                 email: 'justin@email.com',
//                 password:'pwd123'
//             })
//             .then(checkOk)
//             .then(({ body }) => {
//                 token = body.token;
//             });
//     });

//     it.only('signs up a user', () => {
//         assert.isDefined(token);
//     });
// });

// const makeSimple = (reviewer, reviews, film) => {
//     const simple = {
//         _id: reviewer._id,
//         name: reviewer.name,
//         company: reviewer.company
//     };

//     if(reviews) {
//         simple.reviews = reviewer.reviews;
//         simple.reviews[0] = {
//             _id: simple.reviews[0]._id,
//             rating: simple.reviews[0].rating,
//             review: simple.reviews[0].review,
//             film: {
//                 _id: film._id,
//                 title: film.title
        
//             }
//         };
    
//     }
//     return simple;
// };

// let leoActor;
// let legendaryStudio;
// let justinChang;
// let inceptionFilm;
// let inceptionReview;

// const justin = {
//     name: 'Justin Chang',
//     company: 'The Hollywood Reporter',
// };

// const leo = { 
//     name:'Leonardo DiCaprio',
//     dob: new Date('1980-11-12'),
//     pob: 'Beaverton, OR'
// };

// const legendary = {
//     name: 'Legendary',
//     address: {
//         city: 'Santa Monica',
//         state: 'CA',
//         country: 'United States'
//     }
// };

// describe('Reviewers API', () => {

//     beforeEach(() => dropCollection('reviewers'));
//     beforeEach(() => dropCollection('reviews'));
//     beforeEach(() => dropCollection('films'));
//     beforeEach(() => dropCollection('studios'));
//     beforeEach(() => dropCollection('actors'));

//     beforeEach(() => {
//         return request
//             .post('/api/actors')
//             .send(leo)
//             .then(checkOk)
//             .then(({ body }) => leoActor = body);     
//     });
    
//     beforeEach(() => {
//         return request
//             .post('/api/studios')
//             .send(legendary)
//             .then(checkOk)
//             .then(({ body }) => legendaryStudio = body);
//     });
    
//     beforeEach(() => {
//         return request
//             .post('/api/reviewers')
//             .send(justin)
//             .then(checkOk)
//             .then(({ body }) => justinChang = body);
//     });
    
//     beforeEach(() => {
//         return save('films', {
//             title: 'Inception',
//             studio: legendaryStudio._id,
//             released: 2010,
//             cast: [{
//                 role: 'Cobb',
//                 actor: leoActor._id
//             }]
//         })
//             .then(data => inceptionFilm = data);
//     });

//     beforeEach(() => {
//         return save('reviews', {
//             rating: 5,
//             reviewer: justinChang._id,
//             review: 'It was great',
//             film: inceptionFilm._id,
//             createdAt: new Date()
//         })
//             .then(data => inceptionReview = data);
//     });

//     it('saves a reviewer', ()=> {
//         assert.isOk(justinChang._id);
//     });

//     it('gets a reviewer by id', () => {
//         return request
//             .get(`/api/reviewers/${justinChang._id}`)
//             .then(({ body }) => {
//                 justinChang = body;
//                 assert.deepEqual(body, makeSimple(justinChang, inceptionReview, inceptionFilm));
//             });
//     });

//     it('gets a list of reviewers', () => {
//         let injoong;
//         return save('reviewers', {
//             name: 'Injoong Yoon',
//             company: 'Variety' 
//         })
//             .then(_injoong => {
//                 injoong = _injoong;
//                 return request.get('/api/reviewers');
//             })
//             .then(checkOk)
//             .then(({ body }) => {
//                 assert.deepEqual(body, [
//                     justinChang, 
//                     injoong
//                 ]);
//             });
//     });

//     it('updates a reviewer', () => {
//         justinChang.name = 'Robert Thompson';
//         return request
//             .put(`/api/reviewers/${justinChang._id}`)
//             .send(justinChang)
//             .then(({ body }) => {
//                 assert.deepEqual(body, justinChang);
//             });
//     });   
// });

const { createServer } = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../../lib/app');
const server = createServer(app);
const request = chai.request(server).keepOpen();
// const data = require('./data');

request.checkOk = res => {
    if(res.status !== 200) {
        console.log(res.status);
        throw new Error('expected 200 http status code');
    }
    return res;
};

request.save = function(data, resource) {
    return request
        .post(`/api/${resource}`)
        .send(data)
        .then(this.checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });
};

request.saveWithAuth = function(data, resource, token) {
    return request
        .post(`/api/${resource}`)
        .set('Authorization', token)
        .send(data)
        .then(this.checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });
};


// request.saveStudioData = function() {
//     let warner, disney;
//     return request.save(data.studios, 'studios')
//         .then(saved => {
//             data.studios = saved;
//             [warner, disney] = saved;
//             data.films[0].studio = disney._id;
//             return request.save(data.films, 'films'); 
//         })
//         .then(saved => {
//             data.films = saved;
//             return data;
//         });
// };

// request.saveActorData = function() {
//     let tom, emma;
//     return request.save(data.actors, 'actors')
//         .then(saved => {
//             data.actors = saved;
//             [tom, emma] = saved;
//             data.films[0].cast[0].actor = tom._id;
//             data.films[0].cast[1].actor = emma._id;
//             return request.save(data.films, 'films'); 
//         })
//         .then(saved => {
//             data.films = saved;
//             return data;
//         });
// };

// request.saveReviewerData = function() {
//     let token, banks;
//     return this.save(data.reviewers[1], 'reviewers/signup')
//         .then(saved => {
//             data.reviewers[1] = saved.reviewer;
//             token = saved.token;
//             return this.save(data.films[0], 'films'); 
//         })
//         .then(saved => {
//             data.films[0] = saved;
//             banks = saved;
//             data.reviews[0].film = banks._id;
//             return this.saveWithAuth(data.reviews[0], 'reviews', token);
//         })
//         .then(saved => {
//             data.reviews[0] = saved;
//             return data;
//         });
// };

// request.saveAll = function() {
//     let tom, emma;
//     let warner, disney;
//     let arthur, mariah;
//     let banks;
//     return this.save(data.actors, 'actors')
//         .then((saved) => {
//             data.actors = saved;
//             [tom,, emma] = saved;
//             return this.save(data.studios, 'studios');
//         })
//         .then(saved => {
//             data.studios = saved;
//             [warner, disney] = saved;
//             return this.save(data.reviewers, 'reviewers');
//         })
//         .then(saved => {
//             data.reviewers = saved;
//             [arthur, mariah] = saved;
//             data.films[0].studio = disney._id;
//             data.films[0].cast[0].actor = tom._id;
//             data.films[0].cast[1].actor = emma._id;
//             data.films[1].studio = warner._id;
//             return this.save(data.films, 'films');
//         })
//         .then(saved => {
//             data.films = saved;
//             banks = saved[0];
//             data.reviews[0].reviewer = mariah._id;
//             data.reviews[0].film = banks._id;
//             data.reviews[1].reviewer = arthur._id;
//             data.reviews[1].film = banks._id;
//             return this.save(data.reviews, 'reviews');
//         })
//         .then(saved => {
//             data.reviews = saved;
//             return data;
//         });
// };

request.makeSimple = data => {
    const simple = {
        _id: data._id,
    };
    if(data.title) simple.title = data.title;
    if(data.name) simple.name = data.name;
    return simple;
};

after(done => server.close(done));

module.exports = request;

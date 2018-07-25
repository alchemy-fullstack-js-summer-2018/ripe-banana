const { createServer } = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../../lib/app');
const server = createServer(app);
const request = chai.request(server).keepOpen();
const data = require('./data');

request.checkOk = res => {
    if(res.status !== 200) {
        console.log(res.status);
        throw new Error('expected 200 http status code');
    }
    return res;
};

const save = (data, resource) => {
    return request
        .post(`/api/${resource}`)
        .send(data)
        .then(this.checkOk)
        .then(({ body }) => {
            body.forEach(n => delete n.__v);
            return body;
        });
};


request.saveStudioData = () => {
    let warner, disney;
    return save(data.studios, 'studios')
        .then(saved => {
            data.studios = saved;
            [warner, disney] = saved;
            data.films[0].studio = disney._id;
            data.films[1].studio = warner._id;
            return save(data.films, 'films'); 
        })
        .then(saved => {
            data.films = saved;
            return data;
        });
};

request.saveActorData = () => {
    let tom, emma;
    return save(data.actors, 'actors')
        .then(saved => {
            data.actors = saved;
            [tom,, emma] = saved;
            data.films[0].cast[0].actor = tom._id;
            data.films[0].cast[1].actor = emma._id;
            return save(data.films, 'films'); 
        })
        .then(saved => {
            data.films = saved;
            return data;
        });
};

request.saveReviewerData = () => {
    let arthur, mariah;
    let banks;
    return save(data.reviewers, 'reviewers')
        .then(saved => {
            data.reviewers = saved;
            [arthur, mariah] = saved;
            return save(data.films, 'films'); 
        })
        .then(saved => {
            data.films = saved;
            banks = saved[0];
            data.reviews[0].reviewer = mariah._id;
            data.reviews[0].film = banks._id;
            data.reviews[1].reviewer = arthur._id;
            data.reviews[1].film = banks._id;
            return save(data.reviews, 'reviews');
        })
        .then(saved => {
            data.reviews = saved;
            return data;
        });
};

request.saveAll = () => {
    let tom, emma;
    let warner, disney;
    let arthur, mariah;
    let banks;
    return save(data.actors, 'actors')
        .then((saved) => {
            data.actors = saved;
            [tom,, emma] = saved;
            return save(data.studios, 'studios');
        })
        .then(saved => {
            data.studios = saved;
            [warner, disney] = saved;
            return save(data.reviewers, 'reviewers');
        })
        .then(saved => {
            data.reviewers = saved;
            [arthur, mariah] = saved;
            data.films[0].studio = disney._id;
            data.films[0].cast[0].actor = tom._id;
            data.films[0].cast[1].actor = emma._id;
            data.films[1].studio = warner._id;
            return save(data.films, 'films');
        })
        .then(saved => {
            data.films = saved;
            banks = saved[0];
            data.reviews[0].reviewer = mariah._id;
            data.reviews[0].film = banks._id;
            data.reviews[1].reviewer = arthur._id;
            data.reviews[1].film = banks._id;
            return save(data.reviews, 'reviews');
        })
        .then(saved => {
            data.reviews = saved;
            return data;
        });
};

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

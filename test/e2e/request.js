const { createServer } = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../../lib/app');
const server = createServer(app);
const request = chai.request(server).keepOpen();
// const data = require('./data'); //keep for refactoring

request.checkOk = res => {
    if(res.status !== 200) throw new Error('expected 200 http status code');
    return res;
};

request.save = (data, resource) => {
    return request
        .post(`/api/${resource}`)
        .send(data)
        .then(this.checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });
};

request.saveWithAuth = (data, resource, token) => {
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

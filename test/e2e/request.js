const { createServer } = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../../lib/app');
const server = createServer(app);
const request = chai.request(server).keepOpen();

request.checkOk = res => {
    if(res.status !== 200) {
        console.log('** checkOk status***', res.status);
        throw new Error('expected 200 http status code');
    }
    return res;
};

request.simplify = data => {
    const simple = { _id: data._id };
    if(data.title) {
        simple.title = data.title;
    }
    if(data.name) {
        simple.name = data.name;
    }
    return simple;
};

request.getToken = () => request
    .post('/api/reviewers/signup')
    .send({
        email: 'chip@fermentedbanana.com',
        password: 'pw123'
    })
    .then(({ body }) => body.token);


after(done => server.close(done));

module.exports = request;
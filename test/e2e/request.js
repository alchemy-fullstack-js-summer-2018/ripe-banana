const { createServer } = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../../lib/app');
const server = createServer(app);
const request = chai.request(server).keepOpen();
request.checkOk = res => {
    if(res.status !== 200) {
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
    .post('/api/auth/signup')
    .send({
        name: 'chip Ellsworth III',
        company: 'Fermented Banana',
        email: 'chip@banana.com',
        password: 'abc123'
    })
    .then(({ body }) => body.token);

after(done => server.close(done));

module.exports = request;
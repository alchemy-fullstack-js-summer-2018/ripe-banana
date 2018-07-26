const { createServer } = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const { assert } = chai;

const app = require('../../lib/app');
const server = createServer(app);
const request = chai.request(server).keepOpen();

request.checkOk = res => {
    assert.equal(res.status, 200, 'expected http 200 status code');
    return res;
};

// const checkOk = res => {
//     if(res.status !== 200) throw new Error('expected http 200 status code');
//     return res;
// };

// const save = (path, data) => {
//     return request
//         .post(`/api/${path}`)
//         .send(data)
//         .then(checkOk)
//         .then(({ body }) => body);
// };

request.getToken = () => request
    .post('/api/auth/signup')
    .send({
        email:'justin@email.com',
        password: 'pwd123'
    })
    .then(({ body }) => body.token);

after(done => server.close(done));

module.exports = {
    request,
    // save
    // checkOk
};
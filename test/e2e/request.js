const { createServer } = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const app = require('../../lib/app');
const server = createServer(app);
const request = chai.request(server).keepOpen();

request.checkOk = res => {
    if(res.status !== 200) throw new Error('expected 200 http status code');
    return res;
};

// request.getToken = () => request
//     .post('/api/auth/singup')
//     .send({
//         email: 'easton@portland.com',
//         password: 'adamngoodone'
//     })
//     .then(({ body }) => body.token);

after(done => server.close(done));

module.exports = request;
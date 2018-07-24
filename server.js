const http = require('http');
const app = require('./lib/app');
const connect = require('./lib/util/connect');

connect('mongodb://localhost:27017/ripe_banana');

const server = http.createServer(app);
const port = process.env.port || 3000;

server.listen(port, () => {
    // eslint-disable-next-line
    console.log('server running on', server.address().port);
});
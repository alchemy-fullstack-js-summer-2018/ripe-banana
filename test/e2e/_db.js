const connect = require('../../lib/utils/connect');
connect('mongodb://localhost:27017/banana');
const mongoose = require('mongoose');

after(() => {
    return mongoose.connection.close();
});

module.exports = {
    dropDatabase() {
        return mongoose.connection.dropDatabase()
            .catch(err => {
                throw err;
            });
    }
};
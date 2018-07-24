const connect = require('../../lib/util/connect');
connect('mongodb://localhost:27017/ripe-banana');
const mongoose = require('mongoose');

after(() => {
    return mongoose.connection.close();
});

module.exports = {   
    dropCollection(name) {
        return mongoose.connection.dropCollection(name)
            .catch(err => {
                if(err.codeName !== 'NamespaceNotFound') throw err;
            });
    }
};

// repetitive drop collections vs drop db
// module.exports = {
//     dropDatabase() {
//         return mongoose.connection.dropDatabase()
//             .catch(err => {
//                 throw err;
//             });
//     }
//};
const mongoose = require('mongoose');

module.exports = function(dbUri) {
    mongoose.connect(dbUri, { useNewUrlParser: true });

    //success
    mongoose.connection.on('connected', () => {
        console.log('Mongoose default connection open to', dbUri);
    });

    //error
    mongoose.connection.on('error', (err) => {  
        console.log('Mongoose default connection error: ', err);
    });
    //connection disconnected
    mongoose.connection.on('disconnected', () => {  
        console.log('Mongoose default connection disconnected'); 
    });
    // if the node process end, close the Mongoose connection
    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
};

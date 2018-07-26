const request = require('./request');
const { checkOk } = request;

function saveActor(actor, token) {
    return request.post('/api/actors')
        .set('Authorization', token)
        .send(actor)
        .then(checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });
}

function saveFilm(film, token) {
    return request
        .post('/api/films')
        .set('Authorization', token)
        .send(film)
        .then(checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });

}



module.exports = {
    saveActor,
    saveFilm
};
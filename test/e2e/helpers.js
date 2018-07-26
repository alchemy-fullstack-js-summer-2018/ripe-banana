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

function saveReview(review, token) {
    return request
        .post('/api/reviews')
        .set('Authorization', token)
        .send(review)
        .then(checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });

}

function saveReviewer(reviewer, token) {
    return request
        .post('/api/reviewers')
        .set('Authorization', token)
        .send(reviewer)
        .then(checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });

}

function saveStudio(studio, token) {
    return request
        .post('/api/studios')
        .set('Authorization', token)
        .send(studio)
        .then(checkOk)
        .then(({ body }) => {
            delete body.__v;
            return body;
        });

}



module.exports = {
    saveActor,
    saveFilm,
    saveReview,
    saveReviewer,
    saveStudio
};
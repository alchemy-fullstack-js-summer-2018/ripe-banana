const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

function save(review) {
    return request
        .post('/api/reviews')
        .send(review)
        .then(checkOk)
        .then(({ body }) => body);
}

let inception;
let reviewer;
let inceptionReview;

describe.only('Reviews API', () => {

    beforeEach(() => dropCollection('reviews'));
    
    beforeEach(() => {
        return request
            .get('/api/films/5b5567b61b07a52fb46d04a1')
            .then(checkOk)
            .then(({ body }) => inception = body);
    });
    beforeEach(() => {
        return request
            .get('/api/reviewers/5b5567454081862ac88779da')
            .then(checkOk)
            .then(({ body }) => reviewer = body);
    });
    beforeEach(() => {
        return save({
            rating: 5,
            reviewer: reviewer._id,
            review: 'It was great',
            film: inception._id,
            createdAt: new Date()
        })
            .then(data => inceptionReview = data);
    });

    it('saves a review to the database', () => {
        console.log(inceptionReview);
        assert.isOk(inceptionReview._id);
    });

});
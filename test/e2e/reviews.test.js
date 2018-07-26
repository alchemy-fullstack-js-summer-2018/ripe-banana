const { assert } = require('chai');
const { request, save, checkOk } = require('./request');
const { dropCollection } = require('./db');

let leoActor;
let legendaryStudio;
let justinChang;
let inceptionFilm;
let inceptionReview1;
let inceptionReview2;

const justin = {
    name: 'Justin Chang',
    company: 'The Hollywood Reporter',
    email: 'justin@email.com',
    password:'pwd123'

};

const leo = { 
    name:'Leonardo DiCaprio',
    dob: new Date('1980-11-12'),
    pob: 'Beaverton, OR'
};

const legendary = {
    name: 'Legendary',
    address: {
        city: 'Santa Monica',
        state: 'CA',
        country: 'United States'
    }
};

const makeSimple = (review, film) => {
    const simple = {
        _id: review._id,
        rating: review.rating,
        review: review.review,
        createdAt: review.createdAt
    };

    if(film) {
        simple.film = {
            _id: film._id,
            title: film.title
        };
    }

    return simple;
};

describe('Reviews API', () => {

    beforeEach(() => dropCollection('reviews'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('actors'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('reviewers'));

    beforeEach(() => {
        return request
            .post('/api/actors')
            .send(leo)
            .then(checkOk)
            .then(({ body }) => leoActor = body);
    });

    beforeEach(() => {
        return request
            .post('/api/studios')
            .send(legendary)
            .then(checkOk)
            .then(({ body }) => legendaryStudio = body);
    });

    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send(justin)
            .then(checkOk)
            .then(({ body }) => justinChang = body);
    });

    beforeEach(() => {
        return save('films', {
            title: 'Inception',
            studio: legendaryStudio._id,
            released: 2010,
            cast: [{
                role: 'Cobb',
                actor: leoActor._id
            }]
        })
            .then(data => inceptionFilm = data);
    });
    
    beforeEach(() => {
        return save('reviews', {
            rating: 5,
            reviewer: justinChang._id,
            review: 'It was great',
            film: inceptionFilm._id,
            createdAt: new Date('2009-11-11')
        })
            .then(data => inceptionReview1 = data);
    });
    beforeEach(() => {
        return save('reviews', {
            rating: 4,
            reviewer: justinChang._id,
            review: 'It was meh',
            film: inceptionFilm._id,
            createdAt: new Date('2016-10-17')
        })
            .then(data => inceptionReview2 = data);
    });

    it('saves a review to the database', () => {
        assert.isOk(inceptionReview1._id);
    });

    it('gets all reviews from the database', () => {
        return request
            .get('/api/reviews')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [makeSimple(inceptionReview2, inceptionFilm), makeSimple(inceptionReview1, inceptionFilm)]);
            });
    });
});
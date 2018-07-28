const { assert } = require('chai');
const { checkOk } = require('./request');
const  request = require('./request');
const { dropCollection } = require('./db');




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

    let leoActor;
    let legendaryStudio;
    let inceptionFilm;
    let inceptionReview1;
    let token;
    let justin;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Justin Chang',
                company: 'The Hollywood Reporter',
                email: 'justin@email.com',
                password: 'pwd123',
                roles: ['admin']
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
                justin = body.reviewer;

            });
    });

    beforeEach(() => {
        return request
            .post('/api/actors')
            .set('Authorization', token)
            .send(leo)
            .then(checkOk)
            .then(({ body }) => leoActor = body);
    });

    beforeEach(() => {
        return request
            .post('/api/studios') 
            .set('Authorization', token)           
            .send(legendary)
            .then(checkOk)
            .then(({ body }) => legendaryStudio = body);
    });


    beforeEach(() => {
        return request
            .post('/api/films') 
            .set('Authorization', token)           
            .send({
                title: 'Inception',
                studio: legendaryStudio._id,
                released: 2010,
                cast: [{
                    role: 'Cobb',
                    actor: leoActor._id
                }]
            })
            .then(checkOk)
            .then(({ body }) => inceptionFilm = body);
    });

    beforeEach(() => {
        return request
            .post('/api/reviews') 
            .set('Authorization', token)           
            .send({
                rating: 5,
                reviewer: justin._id,
                review: 'It was great',
                film: inceptionFilm._id,
                createdAt: new Date('2009-11-11')
            })
            .then(checkOk)
            .then(({ body }) => inceptionReview1 = body);
    });
    
    it('saves a review to the database', () => {
        assert.isOk(inceptionReview1._id);
    });

    it('gets all reviews from the database', () => {
        return request
            .get('/api/reviews')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [makeSimple(inceptionReview1, inceptionFilm)]);
            });
    });
});
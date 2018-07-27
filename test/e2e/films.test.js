const { assert } = require('chai');
const { save, checkOk } = require('./request');
const request = require('./request');
const { dropCollection } = require('./db');

const makeSimple = (film, studio, actor = null, reviews = null, reviewer = null) => {
    const simple = {
        _id: film._id,
        title: film.title,
        released: film.released
    };

    if(studio) {
        simple.studio = {
            _id: studio._id,
            name: studio.name
        };
    }
    
    if(actor) {
        simple.cast = film.cast;
        simple.cast[0] = {
            _id: simple.cast[0]._id,
            role: simple.cast[0].role,
            actor: {
                _id: actor._id,
                name: actor.name
            }
        };
    }

    if(reviews) {
        simple.reviews = [];
        simple.reviews[0] = {
            _id: reviews._id,
            rating: reviews.rating,
            review: reviews.review,
            reviewer: {
                _id: reviewer._id,
                name: reviewer.name
            }
        };
    }
    return simple;
};

let inceptionFilm;
let legendaryStudio;
let leoActor;
let inceptionReview;

const legendary = {
    name: 'Legendary',
    address: {
        city: 'Santa Monica',
        state: 'CA',
        country: 'United States'
    }
};

const leo = { 
    name:'Leonardo DiCaprio',
    dob: new Date('1980-11-12'),
    pob: 'Beaverton, OR'
};


describe('Films API', () => {

    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));
    beforeEach(() => dropCollection('reviews'));
    beforeEach(() => dropCollection('reviewers'));
    
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
            .post('/api/studios')
            .send(legendary)
            .then(checkOk)
            .then(({ body }) => legendaryStudio = body);
    });

    beforeEach(() => {
        return request
            .post('/api/actors')
            .send(leo)
            .then(checkOk)
            .then(({ body }) => leoActor = body);
    });

    

    beforeEach(() => {
        return save('films', token, {
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
        return save('reviews', token, {
            rating: 5,
            reviewer: justin._id,
            review: '...a loop within the movie\'s plot that binds space and time into...',
            film: inceptionFilm._id,
            createdAt: new Date(),
            updatedAt: new Date()
        })
            .then(data => inceptionReview = data);
    });

    it('saves a film to the database', () => {
        assert.isOk(inceptionFilm._id);
    });

    it('gets all films from the database', () => {
        let dunkirkFilm;
        return save('films', token, {
            title: 'Dunkirk',
            studio: legendaryStudio._id,
            released: 2017,
        })
            .then(data => {
                dunkirkFilm = data;
                return request.get('/api/films');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [
                    makeSimple(inceptionFilm, legendaryStudio),
                    makeSimple(dunkirkFilm, legendaryStudio)
                ]);
            });
    });

    it('gets a single film by ID', () => {
        return request
            .get(`/api/films/${inceptionFilm._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, makeSimple(inceptionFilm, legendaryStudio, leoActor, inceptionReview, justin));
            });
    });

    it('deletes a film', () => {
        return request
            .delete(`/api/films/${inceptionFilm._id}`)
            .set('Authorization', token)
            .then(({ body }) => {
                assert.deepEqual(body, { removed: true });
            });
    });
});
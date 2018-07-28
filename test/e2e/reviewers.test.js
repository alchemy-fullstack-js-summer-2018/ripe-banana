const { assert } = require('chai');
const request = require('./request');
const { checkOk } = request;
const { dropCollection } = require('./db');

describe('Reviewers API', () => {

    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('reviews'));
    beforeEach(() => dropCollection('films'));
    beforeEach(() => dropCollection('studios'));
    beforeEach(() => dropCollection('actors'));

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                email: 'justin@email.com',
                password:'pwd123',
                name: 'Justin Chang',
                company: 'The Hollywood Reporter',
                roles: []
            })
            .then(({ body }) => {
                token = body.token;
                justinChang = body.reviewer;
            });
    });

    it('signs up a user', () => {
        assert.isDefined(token);
    });

    const makeSimple = (reviewer, reviews, film) => {
        const simple = {
            _id: reviewer._id,
            name: reviewer.name,
            company: reviewer.company
        };

        if(reviews) {
            simple.reviews = reviewer.reviews;
            simple.reviews[0] = {
                _id: simple.reviews[0]._id,
                rating: simple.reviews[0].rating,
                review: simple.reviews[0].review,
                film: {
                    _id: film._id,
                    title: film.title
        
                }
            };
    
        }
        return simple;
    };

    let justinChang;
    let inceptionFilm;
    let inceptionReview;


    it('saves a reviewer', ()=> {
        assert.isOk(justinChang._id);
    });

    it('gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${justinChang._id}`)
            .then(({ body }) => {
                justinChang = body;
                assert.deepEqual(body, makeSimple(justinChang, inceptionReview, inceptionFilm));
            });
    });


    it('gets a list of reviewers', () => {
        return request
            .get('/api/reviewers')
            .set('Authorization', token)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [justinChang]);
            });
    });

    it('updates a reviewer', () => {
        justinChang.name = 'Robert Thompson';
        return request
            .put(`/api/reviewers/${justinChang._id}`)
            .send(justinChang)
            .then(({ body }) => {
                assert.deepEqual(body, justinChang);
            });
    });   
});

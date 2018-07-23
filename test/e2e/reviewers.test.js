const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');

const { checkOk } = request;

function save(reviewer) {
    return request
        .post('/api/reviewers')
        .send(reviewer)
        .then(checkOk)
        .then(({ body }) => body); 
}

describe.only('Reviewers API', () => {

    beforeEach(() => dropCollection('reviewers'));
    beforeEach(() => dropCollection('reviews'));
    beforeEach(() => dropCollection('films'));

    // function save(reviewer) {
    //     return request
    //         .post('/api/reviewers')
    //         .send(reviewer)
    //         .then(checkOk)
    //         .then(({ body }) => body); 
    // }

    const makeSimple = (reviewer, review, film) => {
        const simple = {
            _id: reviewer._id,
            company: reviewer.company
        };
    
        if(review) {
            simple.review = reviewer.review;
            simple.review[0] = {
                _id: simple.review[0]._id,
                rating: simple.review[0].rating,
                review: simple.review[0].review
            };
        }
        
        if(film) {
            simple.film = {
                _id: film._id,
                title: film.title

            };
        }
        return simple;
    };

    let inceptionFilm;
    const inception = {
        title: 'Inception',
        studio: inception._id,
        released: 2010
    };
    beforeEach(() => {
        return request
            .post('/api/films')
            .send(inception)
            .then(checkOk)
            .then(({ body }) => inceptionFilm = body);
    });

    let evaluateReview;
    const evaluate = {
        rating: 4,
        review: 'It is boring.'
    };
    beforeEach(() => {
        return request
            .post('api/reviews')
            .send()
    })


    let justinChang;
    beforeEach(() => {
        return save({
            name: 'Justin Chang',
            company: 'The Hollywood Reporter' 
        })
            .then(data => {
                justinChang = data;
            });
    
    });

    it('saves a reviewer', ()=> {
        assert.isOk(justinChang._id);
    });

    it('gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${justinChang._id}`)
            .then(({ body }) => {
                assert.deepEqual(body, justinChang);
            });
    });

    it('gets a list of reviewers', () => {
        let injoong;
        return save({
            name: 'Injoong Yoon',
            company: 'Variety' 
        })
            .then(_injoong => {
                injoong = _injoong;
                return request.get('/api/reviewers');
            })
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [justinChang, injoong]);

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
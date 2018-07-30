const { assert } = require('chai');
const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Review = require('../../lib/models/review');

describe('Review Model', () => {

    it('validates good model', () => {
        const data = {
            rating: 4,
            reviewer: Types.ObjectId(),
            review: 'Movie is terrible and waste of money.',
            film: Types.ObjectId(),
            createdAt: new Date('2008-10-10'),
            updatedAt: new Date()
        };
     
        const review = new Review(data);

        const json = review.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
    });

    it('validates that all fields are required', () => {
        const review = new Review({});
        const errors = getErrors(review.validateSync(), 4);
        assert.equal(errors.rating.kind, 'required');
        assert.equal(errors.review.kind, 'required');
        assert.equal(errors.reviewer.kind, 'required');
        assert.equal(errors.film.kind, 'required');
    });

    it('review has max 140 chars', () => {
        const review = new Review({
            rating: 4,
            reviewer: Types.ObjectId(),
            film: Types.ObjectId(),
            review: 'Movie is terrible and waste of money.N<<N<NNNL::LLL:LLLLLLLLLLLLLLLML>>M>M>M>>Movie is terrible and waste of money.N<<N<NNNL::LLL:LLLLLLLLLLLLLLLML>>M>M>M>>Movie is terrible and waste of money.N<<N<NNNL::LLL:LLLLLLLLLLLLLLLML>>M>M>M>>'
        });

        const errors = getErrors(review.validateSync(), 1);
        assert.equal(errors.review.kind, 'maxlength'); 
    });
});    
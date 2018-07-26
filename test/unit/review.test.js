const chai = require('chai');
const { assert } = chai;
const Review = require('../../lib/models/review');
const { getErrors } = require('./helpers');
const { Types } = require('mongoose');

describe('Review model', () => {

    it('validates good model', () => {
        const data = {
            rating: 5,
            reviewer: Types.ObjectId(),
            review: 'Tom Hanks is the best!',
            film: Types.ObjectId(),
        };
        const review = new Review(data);

        const json = review.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(review.validateSync());
    });

    it('validates required name and company', () => {
        const review = new Review({});
        const errors = getErrors(review.validateSync(), 4);
        assert.equal(errors.rating.kind, 'required');
        assert.equal(errors.reviewer.kind, 'required');
        assert.equal(errors.review.kind, 'required');
        assert.equal(errors.film.kind, 'required');
    });

    it('validates min rating', () => {
        const review = new Review({
            rating: 0,
            reviewer: Types.ObjectId(),
            review: 'Tom Hanks is the best!',
            film: Types.ObjectId(),
        });
        const errors = getErrors(review.validateSync(), 1);
        assert.equal(errors.rating.kind, 'min');
    });

    it('validates max rating', () => {
        const review = new Review({
            rating: 6,
            reviewer: Types.ObjectId(),
            review: 'Tom Hanks is the best!',
            film: Types.ObjectId(),
        });
        const errors = getErrors(review.validateSync(), 1);
        assert.equal(errors.rating.kind, 'max');
    });

    it('validates maxlength of review', () => {
        const review = new Review({
            rating: 5,
            reviewer: Types.ObjectId(),
            review: 'Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!Tom Hanks is the best!',
            film: Types.ObjectId(),
        });
        const errors = getErrors(review.validateSync(), 1);
        assert.equal(errors.review.kind, 'maxlength');
    });

});
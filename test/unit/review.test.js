const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Review = require('../../lib/models/review');
const { Types } = require('mongoose');

describe('Review model', () => {
    
    it('validates a good model', () => {
        const data = {
            rating: 5,
            reviewer: Types.ObjectId(),
            review: 'Srsly, the best film about Injoong to come out this year.',
            film: Types.ObjectId()
            
        };

        const review = new Review(data);
        const json = review.toJSON();

        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(review.validateSync());
    });

    it('validates that a name and company is required', () => {
        const reviewer = new Review({});
        const errors = getErrors(reviewer.validateSync(), 4);
        assert.equal(errors.rating.kind, 'required');
        assert.equal(errors.reviewer.kind, 'required');
        assert.equal(errors.review.kind, 'required');
        assert.equal(errors.film.kind, 'required');
    });
});
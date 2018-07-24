const chai = require('chai');
const { assert } = chai;
const Review = require('../../lib/models/review');
const { getErrors } = require('./helpers');
const { Types } = require('mongoose'); 

describe('Review model', () => {
    
    it('validates good model', () => {
        const data = {
            rating: 3,
            reviewer: Types.ObjectId(),
            review: 'the most meh movie EVER. I mean, who eats apples like that anyway? lame.',
            film: Types.ObjectId()
        };
        const review = new Review(data); 

        const json = review.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(review.validateSync());
    });

    it('validates required rating, reviewer, review, and film ', () => {
        const review = new Review({});
        const errors = getErrors(review.validateSync(), 4);
        assert.equal(errors.rating.kind, 'required');
        assert.equal(errors.reviewer.kind, 'required');
        assert.equal(errors.review.kind, 'required');
        assert.equal(errors.film.kind, 'required');
    });

    it('validates required min rating', () => {
        const review = new Review({
            rating: 0,
            reviewer: Types.ObjectId(),
            review: 'all time favorite movie about dogs',
            film: Types.ObjectId()
        });
        const errors = getErrors(review.validateSync(), 1);
        assert.equal(errors.rating.kind, 'min');
    });

    it('validates required max rating', () => {
        const review = new Review({
            rating: 10,
            reviewer: Types.ObjectId(),
            review: 'omg doggos are the best and so is this movie',
            film: Types.ObjectId()
        }); 
        const errors = getErrors(review.validateSync(), 1);
        assert.equal(errors.rating.kind, 'max');
    });

    it('validates review text length max', () => {
        const review = new Review({
            rating: 3,
            reviewer: Types.ObjectId(),
            review: 'doggos doing doggo things instead of kitty things is super fantastic but kitteh craziness could also be pretty rad imo. But idk who u going to trust with online movie reviews anyway and why are you so into movies about cats and or dogs. I mean, I get it cause I am here spending precious minutes pouring these sophisticated thoughts into the internets for all of you to marvel at. woof. woof woof woof woof woof woof woof woof woof woof woof woof. woof woof. woof woof. woof woof. woof ',
            film: Types.ObjectId()
        });
        const errors = getErrors(review.validateSync(), 1);
        assert.equal(errors.review.kind, 'maxlength');
    });
});
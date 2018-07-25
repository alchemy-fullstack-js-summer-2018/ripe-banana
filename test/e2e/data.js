const { Types } = require('mongoose');
module.exports = {
    studios: [
        {
            name: 'Warner Bros.',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            } 
        },
        {
            name: 'Disney',
            address: {
                city: 'Burbank',
                state: 'California',
                country: 'USA'
            } 
        }
    ],
    actors: [
        {
            name: 'Tom Hanks',
            dob: new Date(1956, 6, 9),
            pob: 'Concord, CA'
        },
        {
            name: 'Emma Thompson',
            dob: new Date(1959, 3, 15),
            pob: 'London, England'
        }
    ],
    reviewers: [
        {
            name: 'Arthur Jen',
            email: 'arthur@gmail.com',
            password: 'whatever',
            company: 'Alchemy Movie Lab'
        },
        {
            name: 'Mariah Adams',
            email: 'mariah@gmail.com',
            password: 'something',
            company: 'The Train Spotters'
        }
    ],
    films: [
        {
            title: 'Saving Mr. Banks',
            studio: Types.ObjectId(),
            released: 2013,
            cast: [
                {
                    role: 'Walt Disney',
                    actor: Types.ObjectId()
                },
                {
                    role: 'P.L. Travers',
                    actor: Types.ObjectId()
                }
            ]
        }
    ],
    reviews: [
        {
            rating: 5,
            reviewer: Types.ObjectId(),
            review: 'Tom Hanks is the best!',
            film: Types.ObjectId()
        }
    ]
};

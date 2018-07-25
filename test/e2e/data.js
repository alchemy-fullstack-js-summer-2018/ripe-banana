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
            name: 'Rachel McAdams',
            dob: new Date(1978, 10, 17),
            pob: 'London, Canada'
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
            company: 'Alchemy Movie Lab'
        },
        {
            name: 'Mariah Adams',
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
        },
        {
            title: 'Game Night',
            studio: Types.ObjectId(),
            released: 2018,
            cast: []
        }
    ],
    reviews: [
        {
            rating: 5,
            reviewer: Types.ObjectId(),
            review: 'Tom Hanks is the best!',
            film: Types.ObjectId()
        },
        {
            rating: 1,
            reviewer: Types.ObjectId(),
            review: 'Haven\'t even seen the movie...',
            film: Types.ObjectId()
        }
    ]
};

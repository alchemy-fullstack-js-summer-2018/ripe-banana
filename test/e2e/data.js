// const { Types } = require('mongoose');
// module.exports = {
//     studios: [
//         {
//             name: 'Warner Bros.',
//             address: {
//                 city: 'Burbank',
//                 state: 'California',
//                 country: 'USA'
//             } 
//         },
//         {
//             name: '20th Century Fox',
//             address: {
//                 city: 'Century City',
//                 state: 'California',
//                 country: 'USA'
//             } 
//         },
//         {
//             name: 'Disney',
//             address: {
//                 city: 'Burbank',
//                 state: 'California',
//                 country: 'USA'
//             } 
//         }
//     ],
//     actors: [
//         {
//             name: 'Tom Hanks',
//             dob: new Date(1956, 6, 9),
//             pob: 'Concord, California, USA'
//         },
//         {
//             name: 'Emma Thompson',
//             dob: new Date(1959, 3, 15),
//             pob: 'London, England, UK'
//         },
//         {
//             name: 'Chris Hemsworth',
//             dob: new Date(1983, 7, 11),
//             pob: 'Melbourne, Victoria, Australia'
//         },
//         {
//             name: 'Robert Downey Jr.',
//             dob: new Date(1965, 3, 4),
//             pob: 'New York City, New York, USA'
//         },
//         {
//             name: 'Chris Evans',
//             dob: new Date(1981, 5, 13),
//             pob: 'Boston, Massachusetts, USA'
//         },
//         {
//             name: 'Scarlett Johansson',
//             dob: new Date(1984, 10, 22),
//             pob: 'New York City, New York, USA'
//         },
//         {
//             name: 'Benedict Cumberbatch',
//             dob: new Date(1976, 6, 19),
//             pob: 'London, England, UK'
//         },
//         {
//             name: 'Tom Holland',
//             dob: new Date(1996, 5, 1),
//             pob: 'Kingston, England, UK'
//         },
//         {
//             name: 'Tom Hiddleston',
//             dob: new Date(1981, 1, 9),
//             pob: 'London, England, UK'
//         },
//         {
//             name: 'Chris Pratt',
//             dob: new Date(1979, 6, 21),
//             pob: 'Virginia, Minnesota, USA'
//         },
//         {
//             name: 'Mark Ruffalo',
//             dob: new Date(1967, 10, 22),
//             pob: 'Kenosha, Wisconsin, USA'
//         },
//         {
//             name: 'Samuel L. Jackson',
//             dob: new Date(1948, 11, 21),
//             pob: 'Washington, DC, USA'
//         },
//         {
//             name: 'Gwyneth Paltrow',
//             dob: new Date(1972, 8, 27),
//             pob: 'Los Angeles, California, USA'
//         }
//     ],
//     reviewers: [
//         {
//             name: 'Arthur Jen',
//             email: 'arthur@gmail.com',
//             password: 'whatever',
//             company: 'Alchemy Movie Lab',
//             roles: ['admin']
//         },
//         {
//             name: 'Mariah Adams',
//             email: 'mariah@gmail.com',
//             password: 'something',
//             company: 'The Train Spotters'
//         },
//         {
//             name: 'Easton Gorishek',
//             email: 'easton@gmail.com',
//             password: 'something',
//             company: 'Alchemy Movie Lab'
//         },
//         {
//             name: 'Bobby Thompson',
//             email: 'bobby@gmail.com',
//             password: 'something',
//             company: 'Alchemy Movie Lab'
//         },
//         {
//             name: 'Injoong Yoon',
//             email: 'injoong@gmail.com',
//             password: 'something',
//             company: 'Alchemy Movie Lab'
//         },
//         {
//             name: 'Seymour',
//             email: 'arf@gmail.com',
//             password: 'woofwoof',
//             company: 'Poochy'
//         },
//         {
//             name: 'Chris Golden',
//             email: 'chris@gmail.com',
//             password: 'whammy',
//             company: 'Gone Baby Gone'
//         }
//     ],
//     films: [
//         {
//             title: 'Saving Mr. Banks',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2013,
//             cast: [
//                 {
//                     role: 'Walt Disney',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf1')
//                 },
//                 {
//                     role: 'P.L. Travers',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf2')
//                 }
//             ]
//         },
//         {
//             title: 'Thor: Ragnarok',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2017,
//             cast: [
//                 {
//                     role: 'Thor',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf3')
//                 },
//                 {
//                     role: 'Loki',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf9')
//                 },
//                 {
//                     role: 'Doctor Strange',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf7')
//                 },
//                 {
//                     role: 'Bruce Banner / The Hulk',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfb')
//                 }
//             ]
//         },
//         {
//             title: 'Avengers: Infinity War',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2018,
//             cast: [
//                 {
//                     role: 'Thor',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf3')
//                 },
//                 {
//                     role: 'Loki',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf9')
//                 },
//                 {
//                     role: 'Doctor Strange',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf7')
//                 },
//                 {
//                     role: 'Bruce Banner / The Hulk',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfb')
//                 },
//                 {
//                     role: 'Tony Stark / Iron Man',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf4')
//                 },
//                 {
//                     role: 'Steve Rogers / Captain America',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf5')
//                 },
//                 {
//                     role: 'Natasha Romanoff / Black Widow',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf6')
//                 },
//                 {
//                     role: 'Peter Parker / Spider-Man',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf8')
//                 },
//                 {
//                     role: 'Peter Quill / Star-Lord',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfa')
//                 },
//                 {
//                     role: 'Nick Fury',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfc')
//                 },
//                 {
//                     role: 'Pepper Potts',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfd')
//                 }
//             ]
//         },
//         {
//             title: 'The Avengers',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2012,
//             cast: [
//                 {
//                     role: 'Thor',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf3')
//                 },
//                 {
//                     role: 'Loki',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf9')
//                 },
//                 {
//                     role: 'Bruce Banner / The Hulk',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfb')
//                 },
//                 {
//                     role: 'Tony Stark / Iron Man',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf4')
//                 },
//                 {
//                     role: 'Steve Rogers / Captain America',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf5')
//                 },
//                 {
//                     role: 'Natasha Romanoff / Black Widow',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf6')
//                 },
//                 {
//                     role: 'Nick Fury',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfc')
//                 },
//                 {
//                     role: 'Pepper Potts',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfd')
//                 }
//             ]
//         },
//         {
//             title: 'Doctor Strange',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2016,
//             cast: [
//                 {
//                     role: 'Doctor Stephen Strange',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf7')
//                 }
//             ]
//         },
//         {
//             title: 'Captain America: Civil War',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2016,
//             cast: [
//                 {
//                     role: 'Tony Stark / Iron Man',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf4')
//                 },
//                 {
//                     role: 'Steve Rogers / Captain America',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf5')
//                 },
//                 {
//                     role: 'Natasha Romanoff / Black Widow',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf6')
//                 },
//                 {
//                     role: 'Peter Parker / Spider-Man',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf8')
//                 }
//             ]
//         },
//         {
//             title: 'Spider-Man: Homecoming',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2017,
//             cast: [
//                 {
//                     role: 'Tony Stark / Iron Man',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf4')
//                 },
//                 {
//                     role: 'Peter Parker / Spider-Man',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf8')
//                 },
//                 {
//                     role: 'Pepper Potts',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfd')
//                 }
//             ]
//         },
//         {
//             title: 'Guardians of the Galaxy',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2014,
//             cast: [
//                 {
//                     role: 'Peter Quill / Star-Lord',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfa')
//                 }
//             ]
//         },
//         {
//             title: 'Guardians of the Galaxy Vol. 2',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2017,
//             cast: [
//                 {
//                     role: 'Peter Quill / Star-Lord',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfa')
//                 }
//             ]
//         },
//         {
//             title: 'Iron Man',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2008,
//             cast: [
//                 {
//                     role: 'Tony Stark / Iron Man',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf4')
//                 },
//                 {
//                     role: 'Pepper Potts',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfd')
//                 }
//             ]
//         },
//         {
//             title: 'Thor',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2011,
//             cast: [
//                 {
//                     role: 'Thor',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf3')
//                 },
//                 {
//                     role: 'Loki',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf9')
//                 }
//             ]
//         },
//         {
//             title: 'Avengers: Age of Ultron',
//             studio: Types.ObjectId('5b59fec3f8940cdfbc4d4e46'),
//             released: 2015,
//             cast: [
//                 {
//                     role: 'Thor',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf3')
//                 },
//                 {
//                     role: 'Bruce Banner / The Hulk',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfb')
//                 },
//                 {
//                     role: 'Tony Stark / Iron Man',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf4')
//                 },
//                 {
//                     role: 'Steve Rogers / Captain America',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf5')
//                 },
//                 {
//                     role: 'Natasha Romanoff / Black Widow',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdf6')
//                 },
//                 {
//                     role: 'Nick Fury',
//                     actor: Types.ObjectId('5b5a0c0f96d7eb6dedd8cdfc')
//                 }
//             ]
//         }
//     ],
//     reviews: [
//         {
//             rating: 5,
//             reviewer: Types.ObjectId(''),
//             review: 'Tom Hanks is the best!',
//             film: Types.ObjectId('')
//         },
//         {
//             rating: 5,
//             reviewer: Types.ObjectId(''),
//             review: '',
//             film: Types.ObjectId('')
//         }
//     ]
// };

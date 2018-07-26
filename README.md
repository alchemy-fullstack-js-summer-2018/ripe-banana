Ripe Banana
=====
This is a database of movies with reviews, movie studios, actors, reviews, and reviewers. It was written using Mongoose/Node/Express, and tested with Mocha/Chai!

## Get Started
1. Fork and clone the repo.
1. Run `npm i` inside the directory to install all the necessary packages.
1. Make your own .env with the correct MongoDB URI and a port of your choice. Look at the `.env.example` file as a guide. You'll need a copy in the root directory and one in the `test` directory as well.
1. In a new terminal window, run your Mongo server.
1. Run `npm start` to start the server.
1. Run `npm run test:watch` to run the tests and build the necessary collections in your MongoDB.

## API
### Paths:
* `/api/films` - response will be an array of film objects.
    * `/api/films/:id` - response will be a film object with the corresponding id.
* `/api/studios` - response will be an array of studio objects.
    * `/api/studios/:id` - response will be a studio object with the corresponding id.
* `/api/actors` - response will be an array of actor objects.
    * `/api/actors/:id` - response will be a actor object with the corresponding id.
* `/api/users` - response will be an array of user objects.
    * `/api/users/:id` - response will be a user object with the corresponding id.
* `/api/reviews` - response will be an array of review objects.

### Methods:
* `POST` - will post an object
* `GET` - will get an array of all objects
* `GET<id>` - will get an object
* `PUT<id>` - will update a specified object
    * Only **actors** and **reviewers** can be updated.
* `DELETE<id>` - will delete a specified object
    * However, **studios** and **actors** cannot be deleted if they have **films** attached to them.
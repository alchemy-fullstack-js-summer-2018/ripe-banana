# Ripe Banana

## Project Description
A play on "Rotten Tomatoes", this project that creates a database with Mongoose that saves films, studios, actors, reviewers and reviews. Uses Express to handle routing to the database. 

## Developer
Requires:
* Node v10 or later.

### How to get started
* Fork repository, clone locally, navigate to repository directory,
* Download all the files with `npm i`,
* To test, run `npm test`. 

### How to use API
* Create your own .env files with the .env.example files provided in the root of the project and the test folder. Enter the correct MongoDB URI. Default port is set to 3000, you may update it to your port of choice.
* Connect to server with `npm run start`.
* Enter `http://localhost:3000` in your browser.
* Database includes movie films, studios, actors, reviews and reviewers.

The following methods are used for the paths listed:

Method | Path
---|---
`GET` |     `/studios`
`GET` |     `/studios/:id`
`GET` |     `/films`
`GET` |     `/films/:id`
`GET` |     `/actors`
`GET` |     `/actors/:id`
`GET` |     `/reviewer`
`GET` |     `/reviewer/:id`
`GET` |     `/reviews/:id`
`POST` |    `/studios`
`POST` |    `/films`
`POST` |    `/actors`
`POST` |    `/reviewers`
`POST` |    `/reviews`
`PUT` |    `/actors/:id`
`PUT` |    `/reviewers/:id`
`DELETE` |    `/studios/:id`
`DELETE` |    `/films/:id`
`DELETE` |    `/actors/:id`

## Contributors
[Mariah Adams](https://github.com/MariahAdams) & [Arthur Jen](https://github.com/arthurjen)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgment 
Forked from [alchemy-fullstack-js-summer-2018/ripe-banana](https://github.com/alchemy-fullstack-js-summer-2018/ripe-banana)
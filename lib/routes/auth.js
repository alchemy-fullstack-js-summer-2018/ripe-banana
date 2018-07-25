// const router = require('express').Router();
// const Reviewer = require('../models/reviewer');
// const { HttpError } = require('../util/errors');
// const tokenService = require('../util/token-service');
// const verifyAuth = require('../util/verify-auth')();

// const getCredentials = body => {
//     const { email, password } = body;
//     delete body.password;
//     return { email, password };
// };

// module.exports = router 
//     .get('/verify', verifyAuth, (req, res) => {
//         res.json({ verified: true });
//     })

//     .post('/signup', ({ body }, res, next) => {
//         const { email, password } = getCredentials(body);

//         Reviewer.findOne({ email })
//             .countDocuments()
//             .then(count => {
//                 if(count > 0) {
//                     throw new HttpError({
//                         code: 400,
//                         message: 'Email already in use'
//                     });
//                 }

//                 const aReviewer = new Reviewer(body);
//                 aReviewer.generateHash(password);
//                 return aReviewer.save();
//             })
//             .then(reviewer => tokenService.sign(reviewer))
//             .then(token => res.json({ token }))
//             .catch(next);
//     });  
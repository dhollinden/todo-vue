const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const { read, create, update, remove } = require('../modules/' + process.env.DB);
const { getAllNotesForUser } = require('../modules/note_functions');


// ------------- Passport -------------

// configure passport to use the local strategy
passport.use(new LocalStrategy(

    { usernameField: 'email' },

    (email, password, done) => {

        const item = 'user'
        const criteria = { 'email': email }

        read(item, criteria)

            .then( user => {

                // if there is no user with this email address, return "done" with error message

                if (!user[0]) {
                   return done(null, false, { message: 'The email address or password is incorrect' });
                }

                // if supplied password doesn't match password associated with email address, return "done" with error message

                if (!bcrypt.compareSync(password, user[0].password)) {
                    return done(null, false, { message: 'The email address or password is incorrect' });
                }

                // the credentials are good, return "done" with the user

                return done(null, user[0]);


            })
            .catch( err => {

                if (err) return done(err);

            });

    }
));


// tell passport how to serialize the user
passport.serializeUser((user, done) => {

    // given a user, call "done" with the user.id

    done(null, user._id);

});


// tell passport how to deserialize the user
passport.deserializeUser((id, done) => {

    // search for user by id

    const item = 'user'
    const criteria = { '_id': id }

    read(item, criteria)

        .then( user => {

            // if user is found, return "done" with the user

            // for some reason, the 'done' callback needs to be called with user[0].id for DynamoDB
            user[0].id = user[0]._id

            return done(null, user[0]);

        })
        .catch( err => {

            // if the search results in an error, return "done" with the error and no user

            if (err) return done(err, false);

        });

});




// ------------- callbacks -------------

// signup POST
exports.signup_post = [

    // validate email and password

    body('email', 'You must enter a valid email address.')
        .isEmail()
        .normalizeEmail(),

    body('password', 'Your password must be at least eight characters long.')
        .isLength({ min: 8 })
        .trim(),

    // sanitize email, but not password

    sanitizeBody('email').trim().escape(),

    // process request

    (req, res, next) => {

        // extract any validation errors

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            // there are validation errors, so send them in response

            res.send({ err: errors.array() })

        }

        else {

            // check whether email address has already been used

            const item = 'user'
            const criteria = { 'email': req.body.email }

            read(item, criteria)

                .then( other_user_with_email => {

                    if (other_user_with_email[0]) {

                        // email is already in use, send error message in response

                        const err = [ { msg: "That email address is already in use. Please try another one." } ]
                        res.send( { err: err } )

                    }

                    // email is not in use, so hash password and create user

                    const saltRounds = 10;
                    passwordHashed = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(saltRounds));

                    const item = 'user'
                    const criteria = {

                        email: req.body.email,
                        password: passwordHashed

                    }

                    create(item, criteria)

                        .then( created_user => {

                            // user was created, so send success message

                            res.send({ success: true })

                        })

                })

                .catch( err => {

                    if (err) return next(err);

                });


        }
    }
];


// login page POST
exports.login_post = [

    // Validate email. Require password, but do not validate min length of 8

    body('email', 'You must enter a valid email address.')
        .isEmail()
        .normalizeEmail(),

    body('password', 'You must enter a password.')
        .isLength({ min: 1 })
        .trim(),

    // Sanitize email, but not password

    sanitizeBody('email').trim().escape(),

    // Process request

    (req, res, next) => {

        // Extract the validation errors

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            // there are validation errors, so send them in response

            res.send({ err: errors.array() })

        }

        else {

            // authenticate using Passport local strategy

            passport.authenticate('local', (err, user, info) => {

                // check for error during authentication

                if (err) return next(err);

                // Passport returns "info" when there are problems with credentials, so send "info" in response

                if (info) {

                    console.log('inside login_post: sending info about bad credentials')
                    const err = [ { msg: info.message } ]
                    res.send( { err: err } )

                }

                // authentication was successful, so log in the user

                req.login(user, (err) => {

                    if (err) return next(err);

                    // login was successful, so respond with success msg

                    res.send({ success: true })

                })

            })(req, res, next);
        }
    }
];


// logout GET
exports.logout_get = function (req, res, next) {

    req.logout();
    res.send({ success: true })

}



// account email update GET
exports.account_email_get = function (req, res, next) {

    res.send({ email: req.user.email })

}



// account email update POST
exports.account_email_post = [

    // Validate email

    body('new_email', 'Please enter a valid email address.')
        .isEmail(),

    // Sanitize email

    sanitizeBody('new_email').trim().escape(),

    // Process request

    (req, res, next) => {

        // Extract validation errors

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            // there are validation errors, so send them in response

            res.send({ err: errors.array() })

        }

        else {

            // check whether email address has already been used

            const item = 'user'
            const criteria = { 'email': req.body.new_email }

            read(item, criteria)

                .then( other_user_with_email => {

                    if (other_user_with_email[0]) {

                        // email is already in use, send error message in response

                        const err = [ { msg: "That email address is already in use. Please try another one." } ]
                        res.send( { err: err } )

                    } else {

                        // update email address

                        const item = 'user'
                        const criteria = { '_id': req.user.id }
                        const updates = { 'email': req.body.new_email }

                        update(item, criteria, updates)

                            .then( updated_user => {

                                // update is successful, so respond with success msg and new email address

                                res.send({
                                    success: true,
                                    new_email: updates.email
                                })

                            })
                    }

                })

                .catch( err => {

                    if (err) return next(err);

                });

        }
    }
];



// account password update POST
exports.account_password_post = [

    // validate new password field

    body('new_password', 'Your new password must be at least eight characters long.')
        .isLength({ min: 8 })
        .trim(),

    // do not sanitize password fields

    // Process request

    (req, res, next) => {

        // Extract the validation errors

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            // there are validation errors, so send them in response

            res.send({ err: errors.array() })

        }

        else {

            // test the submitted current password against what's in database

            if (!bcrypt.compareSync(req.body.cur_password, req.user.password)) {

                // it doesn't match, so respond with error message

                const err = [ { msg: "The current password you entered isn't correct." } ]
                res.send( { err: err } )

            }

            else {

                // passwords match, so hash the new password

                const saltRounds = 10;
                const new_password_hashed = bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(saltRounds));

                // update the password

                const item = 'user';
                const criteria = { '_id': req.user.id };
                const updates = { 'password': new_password_hashed };

                update(item, criteria, updates)

                    .then( result => {

                        // update is successful, so respond with success msg

                        res.send({ success: true })

                    })
                    .catch( err => {

                        if (err) return next(err);

                    })

            }

        }
    }
];


// account delete GET
exports.account_delete = function (req, res, next) {

    // delete all notes for user first

    const item = 'note';
    const criteria = { 'user_id': req.user.id };

    remove(item, criteria)

        .then( deleted_notes => {

            // then delete user

            const item = 'user';
            const criteria = { '_id': req.user.id };

            remove(item, criteria)

                .then( deleted_user => {

                    // logout user, respond with success

                    req.logOut()

                    res.send({ success: true })

                })

        })
        .catch( err => {

            if (err) return next(err);

        });

}



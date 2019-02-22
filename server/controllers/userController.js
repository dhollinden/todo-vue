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

/*
            // for some reason
            // the 'done' callback needs to be called with user[0].id for DynamoDB
            console.log("process.env.DB = ", process.env.DB)
            console.log("deserializeUser: input parameter: id = ", id)
            console.log(`typeof id = ${typeof id}`)
            console.log("user[0] = ", user[0])
            console.log("user[0]._id = ", user[0]._id)
            console.log(`typeof user[0]._id = ${typeof user[0]._id}`)
            console.log("user[0].id = ", user[0].id)
            console.log(`typeof user[0].id = ${typeof user[0].id}`)
*/

            // if user is found, return "done" with the user

            user[0].id = user[0]._id

            return done(null, user[0]);

        })
        .catch( err => {

            // if the search results in an error, return "done" with the error and no user

            if (err) return done(err, false);

        });

});




// ------------- callbacks -------------

// home page GET
exports.index = function (req, res, next) {

    const message = req.query.message;
    const pageContent = {

        title: 'Notes Home',
        message: message,
        authenticated: req.isAuthenticated()

    }

    res.render('index', pageContent);

}


// signup GET
exports.signup_get = function (req, res, next) {

    const pageContent = {

        title: 'Sign Up',
        authenticated: req.isAuthenticated()

    }

    res.render('user_form', pageContent);

};


// signup POST
exports.signup_post = [

    // validate email and password

    body('email', 'You must enter a valid email address.')
        .isEmail(),

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

            // validation errors, render again with error messages and sanitized email

            res.send({
                err: errors.array()
            })
        }

        else {

            // check whether email address has already been used

            const item = 'user'
            const criteria = { 'email': req.body.email }

            read(item, criteria)

                .then( other_user_with_email => {

                    if (other_user_with_email[0]) {

                        // email has been used, render again with error message

                        const emailInUse = {
                            err: [
                                {
                                    msg: "That email address has already been signed up. Please try another one."
                                }
                            ]
                        }
                        res.send(emailInUse)

                    }

                    // email is unique, hash the password

                    const saltRounds = 10;
                    passwordHashed = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(saltRounds));

                    // save user

                    const item = 'user'
                    const criteria = {

                        email: req.body.email,
                        password: passwordHashed

                    }

                    create(item, criteria)

                        .then( created_user => {

                            // user was created, redirect to login page

                            res.send({ success: true })

                        })

                })

                .catch( err => {

                    if (err) return next(err);

                });


        }
    }
];


// login GET
exports.login_get = function (req, res, next) {

    const message = req.query.message;
    const pageContent = {

        title: 'Log In',
        message: message,
        authenticated: req.isAuthenticated()

    }

    res.render('user_form', pageContent);

};


// login page POST
exports.login_post = [

    // Validate email. Require password, but do not validate min length of 8

    body('email', 'You must enter a valid email address.')
        .isEmail(),

    body('password', 'You must enter a password.')
        .isLength({ min: 1 })
        .trim(),

    // Sanitize email, but not password

    sanitizeBody('email').trim().escape(),

    // Process request

    (req, res, next) => {

        console.log('inside login_post: processing request')
        console.log('inside login_post: req.body.email = ', req.body.email)
        console.log('inside login_post: req.body.password = ', req.body.password)

        // Extract the validation errors

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            console.log('inside login_post: there are validation errors')

            // validation errors, render again with error messages and sanitized values

            res.send({
                err: errors.array()
            })

        }

        else {

            // authenticate using Passport local strategy

            passport.authenticate('local', (err, user, info) => {

                // check for authentication error

                if (err) return next(err);

                // if Passport returns "info" about problems with credentials, render page again

                if (info) {

/*
                    const pageContent = {

                        title: 'Log In',
                        email: req.body.email,
                        password: req.body.password,
                        message: info.message,
                        authenticated: req.isAuthenticated()

                    }

                    return res.render('user_form', pageContent);
*/


                    const passportInfo = {
                        err: [
                            {
                                msg: info.message
                            }
                        ]
                    }
                    res.send(passportInfo)

                }

                // authentication was successful, so log user in

                req.login(user, (err) => {

                    console.log('inside login_post: authentication was successful')
                    console.log('inside login_post: authentication was successful, err = ', err)

                    if (err) return next(err);

                    res.send({ success: true })

                })

            })(req, res, next);
        }
    }
];


// logout POST
exports.logout_get = function (req, res, next) {

    req.logout();
    res.send({ success: true })

}



// account GET
exports.account = function (req, res, next) {

    const message = req.query.message;

    getAllNotesForUser(req.user.id)

        .then(notes => {

            // render page

            const pageContent = {

                title: 'My Account',
                email: req.user.email,
                user_id: req.user.id,
                notes: notes,
                message: message,
                authenticated: req.isAuthenticated()

            }

            res.render('user_account', pageContent);

        })

        .catch( err => {

            if (err) return next(err);

        });

};



// account delete GET
exports.account_delete = function (req, res, next) {

    console.log('inside account_delete')
    console.log('inside account_delete: req.user.id = ', req.user.id)

    // delete notes first

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

                    console.log('inside account_delete: delete success')

                    req.logOut()

                    res.send({ success: true })

            })

        })
        .catch( err => {

            if (err) return next(err);

        });

}


// account email update GET
exports.account_email_get = function (req, res, next) {

    // render page

/*
    const pageContent = {

        title: 'My Account: Update Email Address',
        email: req.user.email,
        message: req.query.message,
        authenticated: req.isAuthenticated()

    }

    res.render('user_email_form', pageContent);
*/

    console.log('inside account_email_get, email = ', req.user.email)
    res.send({ email: req.user.email })
}



// account email update POST
exports.account_email_post = [

    // Validate email

    body('new_email', 'Please enter a valid email address for the new email address.')
        .isEmail(),

    // Sanitize email

    sanitizeBody('new_email').trim().escape(),

    // Process request

    (req, res, next) => {

        // Extract validation errors

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            // there are errors, so render again with error messages

            res.send({ err: errors.array() })

        }

        else {

            // check whether email address has already been used

            const item = 'user'
            const criteria = { 'email': req.body.new_email }

            read(item, criteria)

                .then( existing_user => {

                    if (existing_user[0]) {

                        // email has been used, render again with error message

                        const emailInUse = {
                            err: [
                                {
                                    msg: "That new email address has already been used. Please try another one."
                                }
                            ]
                        }
                        res.send(emailInUse)

                    } else {

                        // update email address

                        const item = 'user'
                        const criteria = { '_id': req.user.id }
                        const updates = { 'email': req.body.new_email }

                        update(item, criteria, updates)

                            .then( updated_user => {

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



// account password update GET
exports.account_password_get = function (req, res, next) {

    // render page

    const message = req.query.message;
    const pageContent = {

        title: 'My Account: Update Password',
        message: message,
        authenticated: req.isAuthenticated()

    }

    res.render('user_password_form', pageContent);

}



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

            // there are errors, so render again with error messages

/*
            const pageContent = {

                title: 'My Account: Update Password',
                errors: errors.array(),
                cur_password: req.body.cur_password,
                new_password: req.body.new_password,
                authenticated: req.isAuthenticated()

            }

            res.render('user_password_form', pageContent);
*/

            res.send({ err: errors.array() })

        }

        else {

            // test the submitted current password against what's in database

            if (!bcrypt.compareSync(req.body.cur_password, req.user.password)) {

                // no match, so render page with error message

/*
                const pageContent = {

                    title: 'My Account: Update Password',
                    message: 'incorrect_password',
                    cur_password: req.body.cur_password,
                    new_password: req.body.new_password,
                    authenticated: req.isAuthenticated()

                }

                res.render('user_password_form', pageContent);
*/

                const passwordNoMatch = {
                    err: [
                        {
                            msg: "The current password you entered isn't correct."
                        }
                    ]
                }

                res.send(passwordNoMatch)

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

                        res.send({
                            success: true,
                            new_password: req.body.new_password
                        })

                    })
                    .catch( err => {

                        if (err) return next(err);

                    })

            }

        }
    }
];



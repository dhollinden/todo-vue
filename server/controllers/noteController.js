const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const { read, create, update, remove } = require('../modules/' + process.env.DB);
const { getAllNotesForUser, findNoteById, findAnotherNoteWithSameName } = require('../modules/note_functions');


// notes home GET - display menu with all notes
exports.index = (req, res, next) => {

    getAllNotesForUser(req.user.id)

        .then(notes => {

            // send notes

            res.send({success: true, notes: notes})

        })

        .catch( err => {

            if (err) return next(err);

        });

};


// note detail - display an individual note and menu with all notes
// POST requests from notes menu are routed here
// GET requests from redirects in note_create_post and note_update_post are routed here with note id in params

exports.note_detail = (req, res, next) => {

    // get ID  of requested note

    const requestedNoteId = req.params.id ? req.params.id : req.body.id;

    console.log('inside note_detail: requestedNoteId = ', requestedNoteId)

    getAllNotesForUser(req.user.id)

        .then(notes => {

            // if user does not have note with requestedNoteId, redirect

            const requestedNote = findNoteById(notes, requestedNoteId);
            if (!requestedNote) {
                return res.redirect('/notes?message=invalidId');
            }

            // render page with requestedNote

/*
            const pageContent = {

                title: 'My Notes',
                selectedNote: requestedNote,
                notes: notes,
                message: req.query.message,
                authenticated: req.isAuthenticated()

            }

            res.render('note_detail', pageContent);
*/

            console.log('inside note_detail: requestedNote = ', requestedNote)

            res.send({ success: true, note: requestedNote})

        })

        .catch( err => {

            if (err) return next(err);

        });

};


// note create on GET
exports.note_create_get = (req, res, next) => {

    const pageContent = {

        title: 'Create Note',
        authenticated: req.isAuthenticated()

    }

    res.render('note_form', pageContent);

};


// note create POST
exports.note_create_post = [

// validate note name and body fields

    body('name', 'Please enter a name for the note.')
        .isLength({min: 1})
        .trim(),

    body('body', 'Please enter some notes.')
        .isLength({min: 1})
        .trim(),

    // sanitize note name and body

    sanitizeBody('name').trim().escape(),
    sanitizeBody('body').trim().escape(),

    // process request

    (req, res, next) => {

        // extract any validation errors

        const errors = validationResult(req);

        // create a note object with sanitized data

        const sanitizedNote = {

                name: req.body.name,
                body: req.body.body,
                user_id: req.user.id
        };

        if (!errors.isEmpty()) {

            // validation errors, send back errors

            res.send({ err: errors.array() })

        }

        else {

            getAllNotesForUser(req.user.id)

                .then(notes => {

                    // if user has another note with same name, render form again with sanitized values

                    const anotherNoteWithSameName = findAnotherNoteWithSameName(notes, null, req.body.name);

                    if (anotherNoteWithSameName) {

                        const emailInUse = { err: [ { msg: "A note with that name already exists" } ] }
                        res.send(emailInUse)

                    }

                    // save note, redirect to note detail page

                    const item = 'note';

                    create(item, sanitizedNote)

                        .then( createdNote => {

                            res.send({ success: true })

                        })

                })

                .catch( err => {

                    if (err) return next(err);

                });

        }
    }
];


// note update on GET
exports.note_update_get = (req, res, next) => {

    // get ID  of requested note

    const requestedNoteId = req.params.id;

    getAllNotesForUser(req.user.id)

        .then(notes => {

            // if user does not have note with requestedNoteId, redirect

            const requestedNote = findNoteById(notes, requestedNoteId);
            if (!requestedNote) {
                return res.redirect('/notes?message=invalidId');
            }

            // render page

            const pageContent = {

                title: 'Update Note',
                selectedNote: requestedNote,
                authenticated: req.isAuthenticated()

            }

            res.render('note_form', pageContent);

        })

        .catch( err => {

            if (err) return next(err);

        });

}

// note update on POST
exports.note_update_post = [

    // validate note name and body fields

    body('name', 'A note name is required')
        .isLength({min: 1})
        .trim(),

    body('body', 'Please enter some notes.')
        .isLength({min: 1})
        .trim(),

    // sanitize note name and body fields

    sanitizeBody('name').trim().escape(),
    sanitizeBody('body').trim().escape(),

    // process validated and sanitized request

    (req, res, next) => {

        // extract any validation errors

        const errors = validationResult(req);

        // create a note object with sanitized data ** make sure to use _id of the note being updated **

        const sanitizedNote = (

            {
                name: req.body.name,
                body: req.body.body,
                _id: req.params.id
            }

        );

        if (!errors.isEmpty()) {

            // validation errors, render form again with sanitized values

            res.send({ err: errors.array() })

        }

        else {

            // get ID  of requested note

            const requestedNoteId = req.params.id;

            getAllNotesForUser(req.user.id)

                .then(notes => {

                    // if user does not have note with requestedNoteId, redirect

                    const requestedNote = findNoteById(notes, requestedNoteId);
                    if (!requestedNote) {

                        // return res.redirect('/notes?message=invalidId');
                        res.send({ errors: 'Invalid message ID'})

                    }

                    // if user has another note with same name, render again with error message and sanitized values

                    const anotherNoteWithSameName = findAnotherNoteWithSameName(notes, requestedNoteId, req.body.name);
                    if (anotherNoteWithSameName) {

/*
                        const pageContent = {

                            title: 'Update Note',
                            selectedNote: sanitizedNote,
                            message: 'name_exists',
                            authenticated: req.isAuthenticated()

                        }

                        return res.render('note_form', pageContent);
*/
                        res.send({ errors: 'A note with that name already exists'})

                    }

                    // update note with sanitized values, redirect to note detail page

                    const item = 'note';
                    const criteria = {

                        '_id': requestedNoteId,
                        'user_id': req.user.id

                    };
                    const changes = {

                        name: sanitizedNote.name,
                        body: sanitizedNote.body

                    };

                    update(item, criteria, changes)

                        .then(updated_note => {

                            // redirect to sanitizedNote._id because update does not return a document

                            // res.redirect(`/notes/${sanitizedNote._id}?message=noteUpdated`);
                            res.send({
                                success: true
                            })

                        });

                })
                .catch( err => {

                    if (err) return next(err);

                });

        }
    }

];


// note delete GET
exports.note_delete_get = (req, res, next) => {

    // get ID  of requested note

    const requestedNoteId = req.params.id;

    getAllNotesForUser(req.user.id)

        .then(notes => {

            // if user does not have note with requestedNoteId, redirect

            const requestedNote = findNoteById(notes, requestedNoteId);
            if (!requestedNote) {
                return res.redirect('/notes?message=invalidId');
            }

            // render page

            const pageContent = {

                title: 'Delete Note',
                selectedNote: requestedNote,
                authenticated: req.isAuthenticated()

            }

            res.render('note_delete', pageContent);

        })

        .catch( err => {

            if (err) return next(err);

        });

}


// note delete POST
exports.note_delete_post = (req, res, next) => {

    // get ID  of requested note

    console.log('inside note_delete_post: req.body.id = ', req.body.id)

    const requestedNoteId = req.body.id;

    getAllNotesForUser(req.user.id)

        .then(notes => {

            // if user does not have note with requestedNoteId, redirect

            const requestedNote = findNoteById(notes, requestedNoteId);

            console.log('inside note_delete_post: requestedNote = ', requestedNote)

            if (!requestedNote) {

                // return res.redirect('/notes?message=invalidId');

                console.log('inside note_delete_post: invalid id ')

                res.send({ err: [ { msg: "Invalid note ID" } ] })

            } else {

                // delete requestedNote, redirect to notes page

                console.log('inside note_delete_post: deleting note')

                const item = 'note';
                const criteria = {

                    '_id': requestedNoteId,
                    'user_id': req.user.id

                };

                remove(item, criteria)

                    .then(deleted_note => {

                        // res.redirect('/notes?message=note_deleted');

                        res.send({ success: true })

                    });

            }


        })
        .catch( err => {

            if (err) return next(err);

        });

};
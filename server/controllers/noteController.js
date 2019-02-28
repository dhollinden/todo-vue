const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

const { read, create, update, remove } = require('../modules/' + process.env.DB);
const { getAllNotesForUser, findNoteById, findAnotherNoteWithSameName } = require('../modules/note_functions');


// notes home GET - respond with all notes for user
exports.index = (req, res, next) => {

    getAllNotesForUser(req.user.id)

        .then(notes => {

            // send notes in response

            res.send({ success: true, notes: notes })

        })

        .catch( err => {

            if (err) return next(err);

        });

};


// note detail GET - respond with individual note
exports.note_detail = (req, res, next) => {

    const requestedNoteId = req.params.id;

    getAllNotesForUser(req.user.id)

        .then(notes => {

            const requestedNote = findNoteById(notes, requestedNoteId);

            if (!requestedNote) {

                // user does not have note with requestedNoteId, so respond with err msg

                const err = [ { msg: "There's no note with that id." } ]
                res.send( { err: err } )

            }

            // requested note was found, so respond with success msg and note

            res.send({ success: true, note: requestedNote})

        })

        .catch( err => {

            if (err) return next(err);

        });

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

            // there are validation errors, so send them in response

            res.send({ err: errors.array() })

        }

        else {

            getAllNotesForUser(req.user.id)

                .then(notes => {

                    // if user has another note with same name, respond with err msg

                    const anotherNoteWithSameName = findAnotherNoteWithSameName(notes, null, req.body.name);

                    if (anotherNoteWithSameName) {

                        const err = [ { msg: "You already have a note with that name." } ]
                        res.send( { err: err } )

                    }

                    // save note, redirect to note detail page

                    const item = 'note';

                    create(item, sanitizedNote)

                        .then( createdNote => {

                            // note was created, respond with success msg

                            res.send({ success: true })

                        })

                })

                .catch( err => {

                    if (err) return next(err);

                });

        }
    }
];


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

            // there are validation errors, so send them in response

            res.send({ err: errors.array() })

        }

        else {

            // get ID  of requested note

            const requestedNoteId = req.params.id;

            getAllNotesForUser(req.user.id)

                .then(notes => {

                    const requestedNote = findNoteById(notes, requestedNoteId);

                    // if user does not have note with requestedNoteId, respond with err msg

                    if (!requestedNote) {

                        const err = [ { msg: "There's no note with that id." } ]
                        res.send( { err: err } )

                    }

                    // if user has another note with same name, respond with err msg

                    const anotherNoteWithSameName = findAnotherNoteWithSameName(notes, null, req.body.name);

                    if (anotherNoteWithSameName) {

                        const err = [ { msg: "You already have a note with that name." } ]
                        res.send( { err: err } )

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

                            // note was updated, so respond with success msg

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


// note delete POST
exports.note_delete_post = (req, res, next) => {

    // get ID  of requested note

    const requestedNoteId = req.body.id;

    getAllNotesForUser(req.user.id)

        .then(notes => {

            const requestedNote = findNoteById(notes, requestedNoteId);

            // if user does not have note with requestedNoteId, respond with err msg

            if (!requestedNote) {

                const err = [ { msg: "There's no note with that id." } ]
                res.send( { err: err } )

            }

            else {

                // delete requestedNote

                const item = 'note';
                const criteria = {
                    '_id': requestedNoteId,
                    'user_id': req.user.id
                };

                remove(item, criteria)

                    .then(deleted_note => {

                        // note was deleted, so respond with success msg

                        res.send({ success: true })

                    });

            }


        })
        .catch( err => {

            if (err) return next(err);

        });

};
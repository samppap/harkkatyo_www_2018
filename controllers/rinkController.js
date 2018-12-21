var Rink = require('../models/rink');
var Porter = require('../models/porter');
var Reservation = require('../models/reservation');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        rink_count: function(callback) {
            Rink.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        reservation_count: function(callback) {
            Reservation.countDocuments({}, callback);
        },
        reservation_available_count: function(callback) {
            Reservation.countDocuments({status:'Vapaa'}, callback);
        },
        porter_count: function(callback) {
            Porter.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Kentän varausjärjestelmä', error: err, data: results });
    });
};
// Display list of all rinks.
exports.rink_list = function(req, res, next) {

  Rink.find({}, 'location porter')
    .populate('porter')
    .exec(function (err, list_rinks) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('rink_list', { title: 'Kentät', rink_list: list_rinks });
    });

};

// Display detail page for a specific rink.
exports.rink_detail = function(req, res, next) {

    async.parallel({
        rink: function(callback) {

            Rink.findById(req.params.id)
              .populate('porter')
              .exec(callback);
        },
        reservation: function(callback) {

          Reservation.find({ 'rink': req.params.id })
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.rink==null) { // No results.
            var err = new Error('Kenttää ei löydy.');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('rink_detail', { title: 'Nimi', rink: results.rink, reservations: results.reservation } );
    });

};
// Display rink create form on GET.
exports.rink_create_get = function(req, res, next) {

    // Get all porters, which we can use for adding to our rink.
    async.parallel({
        porters: function(callback) {
            Porter.find(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        res.render('rink_form', { title: 'Lisää kenttä', porters: results.porters });
    });

};

// Handle rink create on POST.
exports.rink_create_post = [
    // Convert the genre to an array.


    // Validate fields.
    body('location', 'Lisää sijainti.').isLength({ min: 1 }).trim(),
    body('porter', 'Lisää kenttämestari.').isLength({ min: 1 }).trim(),

    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a rink object with escaped and trimmed data.
        var rink = new Rink(
          { location: req.body.location,
            porter: req.body.porter

          });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all porters for form.
            async.parallel({
                porters: function(callback) {
                    Porter.find(callback);
                },

            }, function(err, results) {
                if (err) { return next(err); }


                res.render('rink_form', { title: 'Lisää kenttä',porters:results.porters, rink: rink, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save rink.
            rink.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new rink record.
                   res.redirect(rink.url);
                });
        }
    }
];
// Display rink delete form on GET.
exports.rink_delete_get = function(req, res, next) {

    async.parallel({
        rink: function(callback) {
            Rink.findById(req.params.id).exec(callback)
        },
        rinks_porters: function(callback) {
          Porter.find({ 'rink': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.rink==null) { // No results.
            res.redirect('/catalog/rinks');
        }
        // Successful, so render.
        res.render('rink_delete', { title: 'Delete rink', rink: results.rink, rink_porters: results.rinks_porters } );
    });

};

// Handle rink delete on POST.
exports.rink_delete_post = function(req, res, next) {

    async.parallel({
        rink: function(callback) {
          Rink.findById(req.body.rinkid).exec(callback)
        },
        rinks_porters: function(callback) {
          Porter.find({ 'rink': req.body.rinkid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.rinks_porters.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('rink_delete', { title: 'Delete rink', rink: results.rink, rink_porters: results.rinks_porters } );
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Rink.findByIdAndRemove(req.body.rinkid, function deleteRink(err) {
                if (err) { return next(err); }
                // Success - go to author list
                res.redirect('/catalog/rinks')
            })
        }
    });
};

// Display rink update form on GET.
exports.rink_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: rink update GET');
};

// Handle rink update on POST.
exports.rink_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: rink update POST');
};

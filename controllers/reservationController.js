var Reservation = require('../models/reservation');
var Rink = require('../models/rink');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var async = require('async');

// Display list of all reservations.
exports.reservation_list = function(req, res, next) {

  Reservation.find({}, 'day month year time_start time_end rink')
    .populate('rink')
    .exec(function (err, list_reservations) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('reservation_list', { title: 'Varaukset', reservation_list: list_reservations });
    });

};

// Display detail page for a specific reservation.
exports.reservation_detail = function(req, res, next) {

    Reservation.findById(req.params.id)
    .populate('rink')
    .exec(function (err, reservation) {
      if (err) { return next(err); }
      if (reservation==null) { // No results.
          var err = new Error('Varausta ei löytynyt');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('reservation_detail', { title: 'Kenttä:', reservation:  reservation});
    })

};

// Display reservation create form on GET.

exports.reservation_create_get = function(req, res, next) {

    // Get rink locations, which we can use for adding to our reservation.
    async.parallel({
        rinks: function(callback) {
            Rink.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('reservation_form', { title: 'Lisää varaus', rinks: results.rinks });
    });

};

// Handle reservation create on POST.

exports.reservation_create_post = [

    // Validate fields.
    body('rink', 'Anna kenttä').isLength({ min: 1 }).trim(),
    body('day', 'Anna päivä').isLength({ min: 1 }).trim(),
    body('month', 'Anna kuukausi').isLength({ min: 1 }).trim(),
    body('year', 'Anna vuosi').isLength({ min: 1 }).trim(),
    body('time_start', 'Anna alkamisaika').isLength({ min: 1 }).trim(),
    body('time_end', 'Anna loppumisaika').isLength({ min: 1 }).trim(),
    body('name', 'Anna varaajan nimi').isLength({ min: 1 }).trim(),

    // Sanitize fields.
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Reservation object with escaped and trimmed data.
        var reservation = new Reservation(
          { rink: req.body.rink,
            day: req.body.day,
            month: req.body.month,
            year: req.body.year,
            time_start: req.body.time_start,
            time_end: req.body.time_end,
            name: req.body.name

          });

        if (!errors.isEmpty()) {

          // Get rink locations for form.
            async.parallel({
                rinks: function(callback) {
                    Rink.find(callback);
                },

              }, function(err, results) {
                  if (err) { return next(err); }

                  res.render('reservation_form', { title: 'Lisää varaus',rinks:results.rinks, reservation: reservation, errors: errors.array() });
              });
              return;
          }
          else {
              // Data from form is valid. Save reservation.
              reservation.save(function (err) {
                  if (err) { return next(err); }
                     //successful - redirect to new reservation.
                     res.redirect(reservation.url);
                  });
          }
      }
  ];

// Display reservation delete form on GET.

exports.reservation_delete_get = function(req, res, next) {

    async.parallel({
        reservation: function(callback) {
            Reservation.findById(req.params.id).exec(callback)
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.reservation==null) { // No results.
            res.redirect('/catalog/reservations');
        }
        // Successful, so render.
        res.render('reservation_delete', { title: 'Poista varaus', reservation: results.reservation} );
    });

};

// Handle reservation delete on POST.

exports.reservation_delete_post = function(req, res, next) {

    async.parallel({
        reservation: function(callback) {
          Reservation.findById(req.body.reservationid).exec(callback)
        },

    }, function(err, results) {
        if (err) { return next(err); }
        // Success

          // Delete object and redirect to the list of reservations.
          Reservation.findByIdAndRemove(req.body.reservationid, function deleteReservation(err) {
              if (err) { return next(err); }
              // Success - go to reservation list
              res.redirect('/catalog/reservations')
            })

    });
};
// Display reservation update form on GET.
exports.reservation_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: reservation update GET');
};

// Handle reservation update on POST.
exports.reservation_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: reservation update POST');
};

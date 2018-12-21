var Porter = require('../models/porter');
var async = require('async');
var Rink = require('../models/rink');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all porters.
exports.porter_list = function(req, res, next) {

  Porter.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_porters) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('porter_list', { title: 'Vahtimestarit', porter_list: list_porters });
    });

};
// Display detail page for a specific porter.
exports.porter_detail = function(req, res, next) {

    async.parallel({
        porter: function(callback) {
            Porter.findById(req.params.id)
              .exec(callback)
        },
        porters_rinks: function(callback) {
          Rink.find({ 'porter': req.params.id })
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.porter==null) { // No results.
            var err = new Error('Vahtimestaria ei löydetty.');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('porter_detail', { title: 'Vahtimestarin tiedot', porter: results.porter, porter_rinks: results.porters_rinks } );
    });

};
// Display porter create form on GET.
exports.porter_create_get = function(req, res, next) {
    res.render('porter_form', { title: 'Lisää kenttämestari.'});
};

// Handle porter create on POST.
exports.porter_create_post = [

    // Validate fields.
    body('first_name').isLength({ min: 1 }).trim().withMessage('Anna etunimi.')
        .isAlphanumeric().withMessage('Etunimen tulee sisätlää ainoastaan kirjaimia.'),
    body('family_name').isLength({ min: 1 }).trim().withMessage('Anna sukunimi.')
        .isAlphanumeric().withMessage('Sukunimen tulee sisätlää ainoastaan kirjaimia.'),
    body('family_name').isLength({ min: 1, max: 10}).trim().withMessage('Anna puhelinnumero.'),
    // Sanitize fields.
    sanitizeBody('first_name').trim().escape(),
    sanitizeBody('family_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('porter_form', { title: 'Lisää kenttämestari', porter: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an porter object with escaped and trimmed data.
            var porter = new Porter(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    id: req.body.id,
                    phone: req.body.phone
                });
            porter.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new porter record.
                res.redirect(porter.url);
            });
        }
    }
];
// Display porter delete form on GET.

exports.porter_delete_get = function(req, res, next) {

    async.parallel({
        porter: function(callback) {
            Porter.findById(req.params.id).exec(callback)
        },
        porters_rinks: function(callback) {
          Rink.find({ 'porter': req.params.id }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.porter==null) { // No results.
            res.redirect('/catalog/porters');
        }
        // Successful, so render.
        res.render('porter_delete', { title: 'Poista vahtimestari', porter: results.porter, porter_rinks: results.porters_rinks } );
    });

};

// Handle porter delete on POST.

exports.porter_delete_post = function(req, res, next) {

    async.parallel({
        porter: function(callback) {
          Porter.findById(req.body.proterid).exec(callback)
        },
        porters_rinks: function(callback) {
          Rink.find({ 'porter': req.body.proterid }).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.porters_rinks.length > 0) {
            // Porter has rinks. Render in same way as for GET route.
            res.render('porter_delete', { title: 'Poista vahtimestari', porter: results.porter, porter_rinks: results.porters_rinks } );
            return;
        }
        else {
            // Porter has no rinks. Delete object and redirect to the list of porters.
            Porter.findByIdAndRemove(req.body.porterid, function deletePorter(err) {
                if (err) { return next(err); }
                // Success - go to porter list
                res.redirect('/catalog/porters')
            })
        }
    });
};
// Display porter update form on GET.
exports.porter_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: porter update GET');
};

// Handle porter update on POST.
exports.porter_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: porter update POST');
};

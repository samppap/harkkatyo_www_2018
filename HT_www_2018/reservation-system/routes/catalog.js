var express = require('express');
var router = express.Router();

// Require controller modules.
var rink_controller = require('../controllers/rinkController');
var porter_controller = require('../controllers/porterController');
var reservation_controller = require('../controllers/reservationController');

/// RINK ROUTES ///

// GET catalog home page.
router.get('/', rink_controller.index);

// GET request for creating a rink. NOTE This must come before routes that display rink (uses id).
router.get('/rink/create', rink_controller.rink_create_get);

// POST request for creating rink.
router.post('/rink/create', rink_controller.rink_create_post);

// GET request to delete rink.
router.get('/rink/:id/delete', rink_controller.rink_delete_get);

// POST request to delete rink.
router.post('/rink/:id/delete', rink_controller.rink_delete_post);

// GET request to update rink.
router.get('/rink/:id/update', rink_controller.rink_update_get);

// POST request to update rink.
router.post('/rink/:id/update', rink_controller.rink_update_post);

// GET request for one rink.
router.get('/rink/:id', rink_controller.rink_detail);

// GET request for list of all rink items.
router.get('/rinks', rink_controller.rink_list);

/// PORTER ROUTES ///

// GET request for creating porter. NOTE This must come before route for id (i.e. display porter).
router.get('/porter/create', porter_controller.porter_create_get);

// POST request for creating porter.
router.post('/porter/create', porter_controller.porter_create_post);

// GET request to delete porter.
router.get('/porter/:id/delete', porter_controller.porter_delete_get);

// POST request to delete porter.
router.post('/porter/:id/delete', porter_controller.porter_delete_post);

// GET request to update porter.
router.get('/porter/:id/update', porter_controller.porter_update_get);

// POST request to update porter.
router.post('/porter/:id/update', porter_controller.porter_update_post);

// GET request for one porter.
router.get('/porter/:id', porter_controller.porter_detail);

// GET request for list of all porters.
router.get('/porters', porter_controller.porter_list);



/// RESERVATION ROUTES ///

// GET request for creating a reservation. NOTE This must come before route that displays reservation (uses id).
router.get('/reservation/create', reservation_controller.reservation_create_get);

// POST request for creating reservation.
router.post('/reservation/create', reservation_controller.reservation_create_post);

// GET request to delete reservation.
router.get('/reservation/:id/delete', reservation_controller.reservation_delete_get);

// POST request to delete reservation.
router.post('/reservation/:id/delete', reservation_controller.reservation_delete_post);

// GET request to update reservation.
router.get('/reservation/:id/update', reservation_controller.reservation_update_get);

// POST request to update reservation.
router.post('/reservation/:id/update', reservation_controller.reservation_update_post);

// GET request for one reservation.
router.get('/reservation/:id', reservation_controller.reservation_detail);

// GET request for list of all reservation.
router.get('/reservations', reservation_controller.reservation_list);

module.exports = router;

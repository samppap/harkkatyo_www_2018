var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ReservationSchema = new Schema(
  {
    rink: { type: Schema.Types.ObjectId, ref: 'Rink', required: true}, //reference to the associated rink
    day: {type: Number},
    month: {type: Number},
    year: {type: Number},
    time_start: {type: String},
    time_end: {type: String},
    name: {type: String}

  }
);
// Virtual for reservation's location
ReservationSchema
.virtual('Kenttä')
.get(function () {
  return this.rink;
});
// Virtual for reservation's id
ReservationSchema
.virtual('ID')
.get(function () {
  return this.id;
});
// Virtual for reservation's day
ReservationSchema
.virtual('Päivä')
.get(function () {
  return this.day;
});
// Virtual for reservation's month
ReservationSchema
.virtual('Kuukausi')
.get(function () {
  return this.month;
});
// Virtual for reservation's year
ReservationSchema
.virtual('Vuosi')
.get(function () {
  return this.year;
});
// Virtual for reservation's start time
ReservationSchema
.virtual('Alkuaika')
.get(function () {
  return this.time_start;
});
// Virtual for reservation's end time
ReservationSchema
.virtual('Loppuaika')
.get(function () {
  return this.time_end;
});

// Virtual for who have reserved the rink
ReservationSchema
.virtual('Varaaja')
.get(function () {
  return this.name;
});

// Virtual for reservation's URL
ReservationSchema
.virtual('url')
.get(function () {
  return '/catalog/reservation/' + this._id;
});

//Export model
module.exports = mongoose.model('Reservation', ReservationSchema);

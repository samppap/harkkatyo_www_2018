var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RinkSchema = new Schema(
  {
    location: {type: String, required: true},
    porter: {type: Schema.Types.ObjectId, ref: 'Porter', required: true}

  }
);
// Virtual for rinks location
RinkSchema
.virtual('Sijainti')
.get(function () {
  return this.location;
});
// Virtual for rinks porter
RinkSchema
.virtual('Vahtimestari')
.get(function () {
  return this.porter;
});
// Virtual for book's URL
RinkSchema
.virtual('url')
.get(function () {
  return '/catalog/rink/' + this._id;
});

//Export model
module.exports = mongoose.model('Rink', RinkSchema);

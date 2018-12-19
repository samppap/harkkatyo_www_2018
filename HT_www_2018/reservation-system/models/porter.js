var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PorterSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    idnum: {type: String},
    phone: {type: String}
  }
);

// Virtual for porter's full name
PorterSchema
.virtual('Nimi')
.get(function () {
  return this.family_name +""+ this.first_name;
});

// Virtual for porter's id
PorterSchema
.virtual('ID')
.get(function () {
  return this.idnum;
});

// Virtual for porter's phone
PorterSchema
.virtual('Puhelinnumero')
.get(function () {
  return this.phone;
});

// Virtual for porter's URL
PorterSchema
.virtual('url')
.get(function () {
  return '/catalog/porter/' + this._id;
});

//Export model
module.exports = mongoose.model('Porter', PorterSchema);

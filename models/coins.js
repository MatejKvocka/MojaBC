const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  country: String,
  motiv: String,
  popis: String,
  naklad: String,
  year: String,
  quarter: String,
  img_url: String
});

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
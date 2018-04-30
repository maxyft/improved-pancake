var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tickerSchema = new Schema({
	pair: String,
  opendate: Number,
	closedate: Number,
  price: Number,
	change: Number
});
var Order = mongoose.model('Order', tickerSchema);
module.exports = Order;

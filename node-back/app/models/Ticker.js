var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tickerSchema = new Schema({
	name: String,
	rank: Number
});
var Ticker = mongoose.model('Ticker', tickerSchema);
module.exports = Ticker;
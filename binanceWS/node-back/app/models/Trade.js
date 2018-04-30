var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// single trade-obj == 5-minute interval stat sum

var tickerSchema = new Schema({
	pair: String,
	price: {
		last: Number,
		high: {
			type: Number,
			default: 0
		},
		low: {
			type: Number,
			default: 0
		},
		open: {
			type: Number,
			default: 0
		},
		close: {
			type: Number,
			default: 0			
		}
	},
	orders: {
		sell: {
			type: Number,
			default: 0			
		}, 
		buy: {
			type: Number,
			default: 0
		}
	},
	volume: {
		sell: {
			type: Number,
			default: 0
		},
		buy: {
			type: Number,
			default: 0
		}
	},
	filldate: {
		type: Number,
		default: 0
	}
});
var Trade = mongoose.model('Trade', tickerSchema);
module.exports = Trade;
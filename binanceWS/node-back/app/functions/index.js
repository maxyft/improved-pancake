var Ticker = require('..//models/Ticker');
var Trade = require('..//models/Trade');
var WebSocket = require('ws');
var request = require('request');

var tradeQueue = [];
var pendingArr = [];
var tickersTemp = [];
var lastTrades = null;
var lastTimeStamp = null;

function getPairs() {
	return new Promise((resolve) => {
		let pairs = {};
		if(lastTimeStamp == pendingArr[0].filldate) { // response only new pending-data
			pairs.db = lastTrades;
			pairs.pending = pendingArr;
			resolve(pairs);
		} else {
			lastTimeStamp = pendingArr[0].filldate;
			Trade.find({}, { _id: 0, __v: 0 }).sort({filldate: -1}).limit(pendingArr.length * 12 * 6).exec((err, trades) => { // 1-hour raw data
				if(err) console.log(err.message);
				lastTrades = trades;
				if(pendingArr.length) {
					pairs.db = trades
					pairs.pending = pendingArr;
				} else {
					pairs.db = trades
					pairs.pending = null;
				}
				resolve(pairs);
			});
		}
	})
}
function getPair(pairReq) {
	return new Promise((resolve) => {
		Trade.find({ pair: pairReq }, { _id: 0, __v: 0 }).limit(12 * 12).exec((err, trades) => {
			if(err) console.log(err.message);
			if(pendingArr.length) {
				let item = pendingArr.find(item => item.pair === pairReq );
				if(item) trades.unshift(item);
			}
			resolve(trades);
		});
	});
}
function fetchCap() {
	Ticker.remove({}, (err) => {
		if(err) return console.error(err);
	});
	request('https://api.coinmarketcap.com/v1/ticker/?limit=50', function(e, resp, body) {
		let response = JSON.parse(body);
		response.forEach((item, index) => {
			let tmpName = item.symbol;
			if(tmpName === 'USDT') return;
			if(tmpName === 'BTCP') return;
			if(tmpName === "MIOTA") tmpName = "IOTA";
			if(tmpName === "BCH") tmpName = "BCC";
			let ticker = new Ticker({
				name: tmpName,
				rank: item.rank
			});
			tickersTemp.push(ticker);
		});
		Ticker.insertMany(tickersTemp, (err, tickers) => {
			if(err) console.error(err);
		});
		connectToWS();
	});
}
function connectToWS() {
	let streams = [];
	tickersTemp.forEach((item, index) => {
		let stream = null;
		if(index === 0) stream = item.name.toLowerCase() + "usdt@trade";
		else stream = item.name.toLowerCase() + "btc@trade";
		streams.push(stream);
	})
	let streamsString = streams.join("/");
	let ws = new WebSocket('wss://stream.binance.com:9443/stream?streams=' + streamsString);
	ws.on("open", function open() {
		console.log("Connected to socket.");
		createStat();
	});
	ws.on("message", function incoming(response) {
		let parsed = JSON.parse(response).data;
		let pair = parsed.s,
			vol = parsed.q * parsed.p,
			type = (parsed.m == true) ? "sell" : "buy",
			time = parsed.T;

		let	trade = {
			pair: pair,
			orderType: type,
			volume: vol,
			price: parsed.p,
			time: time
		};
		tradeQueue.push(trade);
	});
	ws.on("close", function close(event) {
		if(event.wasClean) console.log("Connection closed clean.")
		else {
			console.log(event.code + " reason: " + event.reason);
			ws = null;
			ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streamsString}`);
		}
		createStat();
	});
}
function createStat() {
	pendingArr = [];
	tradePrices = [];
	let target = Date.now() + 300000; // now + 5 min
	tickersTemp.forEach((item, index) => {
		let pair = '';
		if(index === 0) pair = item.name + 'USDT';
		else pair = item.name + 'BTC';
		let trade = new Trade({
			pair: pair,
			filldate: target
		});
		pendingArr.push(trade);
		let tradePrice = {
			pair: pair,
			prices: []
		};
		tradePrices.push(tradePrice);
	});
	console.log("pending stat-objects array created...");
	updateStat(target);
}
function updateStat(targetTime) {
	if(tradeQueue.length) {
		let trade = tradeQueue.shift();
		if(trade.time >= targetTime || Date.now() >= targetTime) { // end of the interval
			tradeQueue.unshift(trade);
			Trade.insertMany(pendingArr, (err, trades) => {
				if(err) console.log(err);
				createStat();
			});
		} else {
			let pendingItem = pendingArr.find(item => item.pair === trade.pair);

			if(pendingItem.price.open === 0) pendingItem.price.open = trade.price;

			let type = trade.orderType;
			pendingItem.orders[type] += 1;
			pendingItem.volume[type] += trade.volume;
			pendingItem.price.last = trade.price;

			let priceItem = tradePrices.find(item => item.pair === trade.pair);
			let index = priceItem.prices.indexOf(trade.price);
			if(index === -1) priceItem.prices.push(trade.price);

			pendingArr.forEach((item) => { // find min/max/close prices for chart rendering on client
				let prices = tradePrices.find(price => item.pair === price.pair).prices;
				let min = Math.min(...prices);
				let max = Math.max(...prices);
				item.price.low = min;
				item.price.high = max;
				item.price.close = prices[prices.length - 1];
				item.volume.sell = (item.volume.sell).toFixed(8);
				item.volume.buy = (item.volume.buy).toFixed(8);
			});
			updateStat(targetTime);
		}
	} else {
		let t = setInterval(() => {
			tradeQueue.length > 0 ? (clearInterval(t), updateStat(targetTime)) : null;
		}, 100);
	}
}

module.exports = {
	fetchCap: fetchCap,
	getPairs: getPairs,
	getPair: getPair
};

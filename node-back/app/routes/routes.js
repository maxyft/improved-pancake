var fetchCap = require('..//functions').fetchCap; 
var getPairs = require('..//functions').getPairs; 
var getPair = require('..//functions').getPair;

module.exports = function (app, db) {

db.once('open', function() {
    fetchCap();
});

app.get('/pairs', (req, res) => {
	getPairs().then(result => res.send(result));
});

app.get('/pairs/:pair', (req, res) => { 
	getPair(req.params.pair).then(result => res.send(result));
});

}

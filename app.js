var express = require('express');

var log = require('./routes/log');
var station = require('./routes/station');

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Enable CORS.
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.options(/(.*)/, function(req, res, next) {
  res.send(200); // Always respond OK on OPTIONS requests.
});

// Route: logs
app.post('/logs', log.connect, log.save, log.disconnect);
app.get('/logs/:stationId', log.connect, log.allByStation, log.disconnect);
app.get('/logs/:stationId/latest', log.connect, log.latest, log.disconnect);
app.get('/logs/:stationId/coldest', log.connect, log.coldest, log.disconnect);
app.get('/logs/:stationId/hottest', log.connect, log.hottest, log.disconnect);

// Route: stations
app.get('/stations', station.connect, station.all, station.disconnect);

// Start.
http.createServer(app).listen(app.get('port'), function(){
  console.log('Air server listening on port ' + app.get('port'));
});

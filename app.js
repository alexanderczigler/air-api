var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');

var s3client = require('./modules/s3client.js');

var log = require('./routes/log');
var station = require('./routes/station');
var path = require('path');

var app = express();
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);

// CORS.
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.options(/(.*)/, function(req, res, next) {
  res.send(200); // Always respond OK on OPTIONS requests.
});

/*
 * Route: /readings
 */
app.put('/readings', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  console.log('test', req.body);
  s3client.storeWeatherReading(req.body, function (data) {
    res.send(data);
    res.end(200);
  }, function (error) {
    console.log('Error when calling KI.', error);
    res.end(500);
  });
});

// Route: logs
app.post('/logs', log.connect, log.save, log.disconnect);
app.get('/logs/:stationId', log.connect, log.allByStation, log.disconnect);
app.get('/logs/:stationId/latest', log.connect, log.latest, log.disconnect);
app.get('/logs/:stationId/coldest', log.connect, log.coldest, log.disconnect);
app.get('/logs/:stationId/hottest', log.connect, log.hottest, log.disconnect);
app.get('/logs/:stationId/average', log.connect, log.average, log.disconnect);

// Route: stations
app.get('/stations', station.connect, station.all, station.disconnect);

// Start.
http.createServer(app).listen(app.get('port'), function(){
  console.log('Air server listening on port ' + app.get('port'));
});

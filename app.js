var express = require('express');
var http = require('http');

var config = require('./air.config.json');
var s3client = require('./modules/s3client.js');
var station = require('./routes/station');

var app = express();
app.use(require('body-parser').json());
app.set('port', process.env.PORT || 3000);



/*
 * CORS.
 */
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

  if (!req.body.secret) {
    res.send({'Message': 'Secret missing.'});
    res.end(500);
    return;
  }

  if (!req.body.reading) {
    res.send({'Message': 'Reading missing.'});
    res.end(500);
    return;
  }

  if (!req.body.reading.station) {
    res.send({'Message': 'Reading lacks station.'});
    res.end(500);
    return;
  }

  if (req.body.secret !== config.storeSecret) {
    res.send({'Message': 'Unauthorized.'});
    res.end(403);
    return;
  }

  s3client.storeReading(req.body.reading, function (data) {
    res.send(data);
    res.end(200);
  }, function (error) {
    res.send({'Error': error});
    res.end(500);
  });
});

app.get('/readings', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  s3client.listReadings(req.query, 100, function (data) {
    res.send(data);
    res.end(200);
  }, function (error) {
    res.send({'Error': error});
    res.end(500);
  });
});

app.get('/readings/:key', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  s3client.getReading(req.params.key, function (data) {
    res.send(data);
    res.end(200);
  }, function (error) {
    res.send({'Error': error});
    res.end(500);
  });
});



/*
 * Start.
 */
http.createServer(app).listen(app.get('port'), function(){
  console.log('Air server listening on port ' + app.get('port'));
});

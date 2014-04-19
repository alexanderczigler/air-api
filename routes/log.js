var _connection;

exports.connect = function(req, res, next) {
  try {
    var config = require('../air.config.json');
    var mysql = require('mysql');
    _connection = mysql.createConnection({
      host: config.db.host,
      user: config.db.username,
      password: config.db.password,
      port: config.db.port
    });
    next();
  } catch(e) {
    console.log('mysql error', e);
    next(e);
  }
};

exports.disconnect = function() {
  try {
    _connection.end();
  }
  catch (e) {
    console.log('Error when attempting to close connection.', e);
  }
}


/*
 * Saves a log.
 */
exports.save = function (req, res, next) {

  var uuid = require('node-uuid');

  var log = req.body;

  log.Id = uuid.v4();
  var d, year, month, day, formattedDate;
  d = new Date(log.Date);
  year = d.getFullYear();
  month = d.getMonth()+1; // January is apparently 0.
  if (month < 10) {
    month = "0" + month;
  }
  day = d.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  formattedDate = year + '-' + month + '-' + day;

  var insert = "INSERT INTO `air`.`logs` (`Id`, `StationId`, `Date`, `Time`, `TempOut`, `FeelsLike`, `HumidityOut`, `WindDirection`, `WindAvg`, `WindGust`, `Rain`, `AbsPressure`)";
  insert += "VALUES ('%Id%', '%StationId%', '%Date%', '%Time%', '%TempOut%', '%FeelsLike%', '%HumidityOut%', '%WindDirection%', '%WindAvg%', '%WindGust%', '%Rain%', '%AbsPressure%');";

  insert = insert.replace('%Id%', log.Id);
  insert = insert.replace('%StationId%', log.StationId);
  insert = insert.replace('%Date%', formattedDate);
  insert = insert.replace('%Time%', log.Time);
  insert = insert.replace('%TempOut%', log.TempOut);
  insert = insert.replace('%FeelsLike%', log.FeelsLike);
  insert = insert.replace('%HumidityOut%', log.HumidityOut);
  insert = insert.replace('%WindDirection%', log.WindDirection);
  insert = insert.replace('%WindAvg%', log.WindAvg);
  insert = insert.replace('%WindGust%', log.WindGust);
  insert = insert.replace('%Rain%', log.Rain);
  insert = insert.replace('%AbsPressure%', log.AbsPressure);

  try {

    _connection.query(insert, function (err, rows, fields) {
      if (err) {
        throw err;
      }

      res.setHeader('Content-Type', 'application/json');
      res.send(log);
      res.end();

    });
  } catch (e) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(log);
  }
  finally {
    next();
  }
};



/*
 * Gets all logs.
 */
exports.all = function (req, res, next) {

  res.setHeader('Content-Type', 'application/json');

  try {

    var getQuery = 'SELECT * FROM `air`.`logs` ORDER BY `Date` DESC, `Time` DESC LIMIT 0,168';

    _connection.query(getQuery, function (err, rows, fields) {
      if (err)
        throw err;

      res.send(rows);
    });
  }
  catch (e) {
    res.end("error");
  }
  finally {
    next();
  }
};



/*
 * Gets all logs by station.
 */
exports.allByStation = function (req, res, next) {

  res.setHeader('Content-Type', 'application/json');

  try {

    var stationId = req.params.stationId;
    var getQuery = 'SELECT * FROM `air`.`logs` WHERE `StationId` = ? ORDER BY `Date` DESC, `Time` DESC LIMIT 0,168';
    var params = [stationId];

    _connection.query(getQuery, params, function (err, rows, fields) {
      if (err)
        throw err;

      res.send(rows);
    });
  }
  catch (e) {
    res.end("error");
  }
  finally {
    next();
  }
};



/*
 * Gets the latest log.
 */
exports.latest = function (req, res, next) {

  res.setHeader('Content-Type', 'application/json');

  try {

    var stationId = req.params.stationId;
    var getQuery = 'SELECT * FROM `air`.`logs` WHERE `StationId` = ? ORDER BY `Date` DESC, `Time` DESC LIMIT 0,1';
    var params = [stationId];
    _connection.query(getQuery, params, function (err, rows, fields) {
      if (err)
        throw err;

      res.send(rows);
    });
  }
  catch (e) {
    res.end("error");
  }
  finally {
    next();
  }
};

/*
 * Gets the latest log.
 */
exports.coldest = function (req, res, next) {

  res.setHeader('Content-Type', 'application/json');

  try {

    var stationId = req.params.stationId;
    var getQuery = 'SELECT * FROM `air`.`logs` WHERE `StationId` = ? ORDER BY `TempOut` ASC, `Time` DESC LIMIT 0,1';
    var params = [stationId];
    _connection.query(getQuery, params, function (err, rows, fields) {
      if (err)
        throw err;

      res.send(rows);
    });
  }
  catch (e) {
    res.end("error");
  }
  finally {
    next();
  }
};

/*
 * Gets the latest log.
 */
exports.hottest = function (req, res, next) {

  res.setHeader('Content-Type', 'application/json');

  try {

    var stationId = req.params.stationId;
    var getQuery = 'SELECT * FROM `air`.`logs` WHERE `StationId` = ? ORDER BY `TempOut` DESC, `Time` DESC LIMIT 0,1';
    var params = [stationId];
    _connection.query(getQuery, params, function (err, rows, fields) {
      if (err)
        throw err;

      res.send(rows);
    });
  }
  catch (e) {
    res.end("error");
  }
  finally {
    next();
  }
};

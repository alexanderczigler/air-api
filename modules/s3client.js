var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var config = require('../air.config.json');

module.exports = {
  storeReading: function(reading, successCallback, errorCallback) {
    reading.id = this.generateNewKey(reading.station);
    var params = {
      Bucket: config.s3.bucket,
      Key: reading.id,
      ACL: 'public-read',
      Body: JSON.stringify(reading),
      ContentType: 'application/json',
      StorageClass: 'STANDARD'
    };
    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        errorCallback(err);
      }
      else {
        successCallback(data);
      }
    });
  },
  getReadings: function(filter, successCallback, errorCallback) {
    this.listReadings(filter, 100, function(reading) {
      successCallback(reading.Contents);
    }, errorCallback);
  },
  getReading: function(key, successCallback, errorCallback) {
    var params = {
      Bucket: config.s3.bucket,
      Key: key,
    };
    s3.getObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        errorCallback(err);
        return;
      }
      if (!data.Body){
        errorCallback('No data.Body');
        return; 
      }
      successCallback(data.Body.toString());
    });
  },
  listReadings: function(station, count, successCallback, errorCallback) {
    var params = {
      Bucket: config.s3.bucket,
      MaxKeys: count,
      Prefix: station
    };
    s3.listObjects(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
        errorCallback(err);
      }
      else {
        successCallback(data);
      }
    });
  },
  generateNewKey: function(station) {
    var now = new Date();
    
    var name = station + '.';
    name += now.getUTCFullYear().toString();
    name += this.padString((now.getUTCMonth() + 1).toString(), 2);
    name += this.padString(now.getUTCDate().toString(), 2);
    name += this.padString(now.getUTCHours().toString(), 2);
    name += this.padString(now.getUTCMinutes().toString(), 2);
    name += this.padString(now.getUTCSeconds().toString(), 2);
    name += this.padString(now.getMilliseconds().toString(), 3);
    return name;
  },
  padString: function(num, size) {
    var s = num+"";
    while (s.length < size) {
      s = "0" + s
    };
    return s;
  }
}
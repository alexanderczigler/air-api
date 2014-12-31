var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var config = require('../air.config.json');

module.exports = {
  storeWeatherReading: function(reading, successCallback, errorCallback) {
    var params = {
      Bucket: config.s3.bucket,
      Key: this.getName(reading.station),
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
  listWeatherReadings: function(station, successCallback, errorCallback) {
    var params = {
      Bucket: config.s3.bucket,
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
  getName: function(station) {
    var now = new Date();
    
    var name = station + '-';
    name += now.getUTCFullYear().toString();
    name += (now.getUTCMonth() + 1).toString();
    name += this.pad(now.getUTCDate().toString(), 2);
    name += this.pad(now.getUTCHours().toString(), 2);
    name += this.pad(now.getUTCMinutes().toString(), 2);
    name += this.pad(now.getUTCSeconds().toString(), 2);
    name += this.pad(now.getMilliseconds().toString(), 3);
    name += '.json';
    return name;
  },
  pad: function pad(num, size) {
    var s = num+"";
    while (s.length < size) {
      s = "0" + s
    };
    return s;
  }
}
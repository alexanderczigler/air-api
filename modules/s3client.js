var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var config = require('../air.config.json');

module.exports = {
  storeWeatherReading: function(reading, successCallback, errorCallback) {
    var now = new Date();
    var params = {
      Bucket: config.s3.bucket,
      Key: this.getName(),
      ACL: 'public-read',
      Body: JSON.stringify(reading),
      ContentType: 'application/json',
      StorageClass: 'STANDARD'
    };
    s3.putObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      }
      else {
        console.log(data);
      }
    });
  },
  getName: function() {
    var now = new Date();
    
    var name = '';
    name += now.getUTCFullYear().toString();
    name += (now.getUTCMonth() + 1).toString();
    name += this.pad(now.getUTCDate().toString(), 2);
    name += this.pad(now.getUTCHours().toString(), 2);
    name += this.pad(now.getUTCMinutes().toString(), 2);
    name += this.pad(now.getUTCSeconds().toString(), 2);

    name += '.txt';
    console.log(name);
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
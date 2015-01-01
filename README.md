air-api
=======

Weather data JSON API.

Uses Amazon S3 for storing weather readings in JSON format. Can handle multiple weather stations.

setup
=====

After cloning the project, do npm install.
Then, go to your Amazon AWS account and setup an S3 bucket + a user with access.
The user's access policy should look something like this (where "weather-data-store" is replaced with the name of your bucket)

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::weather-data-store",
        "arn:aws:s3:::weather-data-store/*"
      ]
    }
  ]
}
```

Create a credentials file at ~/.aws/credentials on Mac/Linux or C:\Users\USERNAME\.aws\credentials on Windows

```
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

For more information about the AWS SDK, see http://aws.amazon.com/sdk-for-node-js

Last of all, create a new file called "air.config.json". This is where you set the name of your S3 bucket and a secret used by clients saving weather readings.

```
{
  "s3": {
    "bucket": "weather-data-store"
  },
  "storeSecret": "hello"
}
```

store data
==========

To store a weather reading, PUT a JSON object to the /readings route.
You can try this manually with curl.

```
curl -X PUT -H "Content-Type: application/json" -d '{"secret":"hello", "reading": {"station":"my-weather-station", "tempOut": 4.0}}' http://localhost:3000/readings
```

The "secret" property is a simple measure to fend off unauthorized use of the API. Note however that it is not 100 % secure, it can for example be picked up by someone that has access to the network traffic between your weather station and your API.

If you wish to further improve the security of your API, you could put it behind a proxy and/or firewall that define specific access rules.
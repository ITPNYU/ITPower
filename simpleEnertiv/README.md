# A simple Node client to get Enertiv data

## What are we trying to do ?

* Get data about Power in ITP from the enertiv server
* Try and make this data available on a website (realtime)

## Why are we using Node ?

## How to install Node

## Summary of steps

* Get a clientID that will help us access the data on the enertiv server - [sample details](https://api.enertiv.com/o/applications/)
* Use the login details to create a string to send to the server

```javascript

var querystring = require('querystring');
/*

 set up the options for the login.
 fill in your client_id and client_secret here:

 ---

 var loginData = querystring.stringify({
 	'client_id': process.env.ENERTIV_CLIENT_ID,
 	'client_secret': process.env.ENERTIV_CLIENT_SECRET,
 	'grant_type': 'password',
 	'username': process.env.ENERTIV_USERNAME,
 	'password': process.env.ENERTIV_PASSWORD,
 });

*/

/* To make it simple, we will add the credentials here for now */



var loginData = querystring.stringify({
	'client_id':'',
	'client_secret': '',
	'grant_type': 'password',
	'username': '',
	'password': '',

})

```

* Before logging in, we would need to set up the HTTP request options so that it knows what it is receiving. (Add the below snippet)

```javascript

var https = require('https');

// set up the HTTPS request options. You'll modify and
// reuse this for subsequent calls:
var httpsRequestOptions = {
  rejectUnauthorized: false,
  method: 'POST',
  host: 'api.enertiv.com',
  port: 443,
  path: '/o/token/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': loginData.length
  }
};

```

* Now let's add the function to login and save the accessToken (Add the below snippet)

```javascript
/*
	the callback function to be run when the response comes in.
	this callback assumes a chunked response, with several 'data'
	events and one final 'end' response.
*/
var accessToken;
function saveToken(response) {
  var result = '';		// string to hold the response
  // as each chunk comes in, add it to the result string:
  response.on('data', function (data) {
    result += data;
  });

  // when the final chunk comes in, print it out:
  response.on('end', function () {
    result = JSON.parse(result);
    accessToken = result.access_token;
    console.log(result);
  });
}
```

* Now to make the actual HTTP request

```javascript

// make the login request:
var request = https.request(httpsRequestOptions, saveToken);	// start it
request.write(loginData);                       // add  body of  POST request
request.end();

```

* ### **TESTING TIME!** ( Your code should now be looking something like this)

```javascript

var https = require('https');
var querystring = require('querystring');
/*

 set up the options for the login.
 fill in your client_id and client_secret here:

 ---

 var loginData = querystring.stringify({
 	'client_id': process.env.ENERTIV_CLIENT_ID,
 	'client_secret': process.env.ENERTIV_CLIENT_SECRET,
 	'grant_type': 'password',
 	'username': process.env.ENERTIV_USERNAME,
 	'password': process.env.ENERTIV_PASSWORD,
 });

*/

/* To make it simple, we will add the credentials here for now */



var loginData = querystring.stringify({
	'client_id':'',
	'client_secret': '',
	'grant_type': 'password',
	'username': '',
	'password': '',

});

// set up the HTTPS request options. You'll modify and
// reuse this for subsequent calls:
var httpsRequestOptions = {
  rejectUnauthorized: false,
  method: 'POST',
  host: 'api.enertiv.com',
  port: 443,
  path: '/o/token/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': loginData.length
  }
};

var accessToken;
function saveToken(response) {
  var result = '';		// string to hold the response
  // as each chunk comes in, add it to the result string:
  response.on('data', function (data) {
    result += data;
  });

  // when the final chunk comes in, print it out:
  response.on('end', function () {
    result = JSON.parse(result);
    accessToken = result.access_token;
    console.log(result);
  });
}

// make the login request:
var request = https.request(httpsRequestOptions, saveToken);	// start it
request.write(loginData);                       // add  body of  POST request
request.end();


```

* Now run ``` node client.js ```
You should something similar
```
172-16-217-33:simpleEnertiv kanini$ node client.js
{ scope: 'read write',
  expires_in: 36000,
  token_type: 'Bearer',
  access_token: '5FYNhv3753GqVJXBNuhPdNxeDAPLhW',
  refresh_token: 'ANAmdXOKxlSNWPxn0VfamT7mPXNihD' }
```

* Once this is done, now we can get some data from the server. Let's create a function to request for the client information. We need to change the HTTP options here.

```javascript
var clientData;


function getClientInfo(path, token) {
  httpsRequestOptions.path = path;
  httpsRequestOptions.method = 'GET';
  httpsRequestOptions.headers = {
    'Authorization': 'Bearer ' + token
  }
  request = https.get(httpsRequestOptions, function (response) { // make the API call
    var result = '';
    // as each chunk comes in, add it to the result string:
    response.on('data', function (data) {
      result += data;
    });

    // when the final chunk comes in, print it out:
    response.on('end', function () {
      result = JSON.parse(result);
      clientData = result;
      console.log('****************');
      console.log(clientData);
      console.log('****************');
      console.log(accessToken);
      console.log('****************');
    });
  });
}
```

* Now let's call that function once we save the access token.
(change saveToken function like below)

```javascript

function saveToken(response) {
  var result = '';		// string to hold the response
  // as each chunk comes in, add it to the result string:
  response.on('data', function (data) {
    result += data;
  });

  // when the final chunk comes in, print it out:
  response.on('end', function () {
    result = JSON.parse(result);
    accessToken = result.access_token;
		getClientInfo('/api/client/', accessToken);
		console.log(result);
  });
}

```

But wait - how did we know to put in ```api/client``` ? Here is a list of [available endpoints](https://api.enertiv.com/docs/). Bookmark it. Now.

* Test again! Yay!
you should get something like this

```

{ scope: 'read write',
  expires_in: 36000,
  token_type: 'Bearer',
  access_token: '69KpF8GtK1Jl2ugy3EJz3g3TjtMNqh',
  refresh_token: '2vDTSZnWC6Edti1utF0JpDZteQ2uel' }
****************
[ { id: 'ad4394d7-ad81-4d1c-adea-51b3213c291c',
    parent_client: null,
    subscription: 'Basic',
    name: 'NYU ITP',
    address_1: null,
    address_2: null,
    city: null,
    state: null,
    suite: null,
    floor: null,
    zip: null,
    zip4: null,
    logo: 'logos/ITP_2_sIrP1nN.png',
    locations: [ '5ae33444-387d-46f6-9be0-3c4b54f53561' ],
    move_in_date: null,
    move_out_date: null,
    property_values: {} } ]
****************
69KpF8GtK1Jl2ugy3EJz3g3TjtMNqh
****************

```

* Ok, let's cheat a bit. Now we have the ```location_id``` from our previous output. Let's use this along with [this endpoint](https://api.enertiv.com/docs/#!/location/location_read) to pass a different path to ```getClientInfo```
so replace

```javascript
getClientInfo('/api/client/', accessToken);
```

with this
```javascript
// getClientInfo('/api/client/', accessToken);
getClientInfo('/api/location/5ae33444-387d-46f6-9be0-3c4b54f53561/', accessToken);
```

Maybe we should change it to ```getInfo```?
So here is the ### COMPLETE CODE

``` javascript

var https = require('https');
var querystring = require('querystring');
/*

 set up the options for the login.
 fill in your client_id and client_secret here:

 ---

 var loginData = querystring.stringify({
 	'client_id': process.env.ENERTIV_CLIENT_ID,
 	'client_secret': process.env.ENERTIV_CLIENT_SECRET,
 	'grant_type': 'password',
 	'username': process.env.ENERTIV_USERNAME,
 	'password': process.env.ENERTIV_PASSWORD,
 });

*/

/* To make it simple, we will add the credentials here for now */

var clientData;

var loginData = querystring.stringify({
	'client_id':'',
	'client_secret': '',
	'grant_type': 'password',
	'username': '',
	'password': '',

});

// set up the HTTPS request options. You'll modify and
// reuse this for subsequent calls:
var httpsRequestOptions = {
  rejectUnauthorized: false,
  method: 'POST',
  host: 'api.enertiv.com',
  port: 443,
  path: '/o/token/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': loginData.length
  }
};

var accessToken;
function saveToken(response) {
  var result = '';		// string to hold the response
  // as each chunk comes in, add it to the result string:
  response.on('data', function (data) {
    result += data;
  });

  // when the final chunk comes in, print it out:
  response.on('end', function () {
    result = JSON.parse(result);
    accessToken = result.access_token;
		// getInfo('/api/client/', accessToken);
		getInfo('/api/location/5ae33444-387d-46f6-9be0-3c4b54f53561/', accessToken);
		console.log(result);
  });
}


function getInfo(path, token) {
  httpsRequestOptions.path = path;
  httpsRequestOptions.method = 'GET';
  httpsRequestOptions.headers = {
    'Authorization': 'Bearer ' + token
  }
  request = https.get(httpsRequestOptions, function (response) { // make the API call
    var result = '';
    // as each chunk comes in, add it to the result string:
    response.on('data', function (data) {
      result += data;
    });

    // when the final chunk comes in, print it out:
    response.on('end', function () {
      result = JSON.parse(result);
      clientData = result;
      console.log('****************');
      console.log(clientData);
      console.log('****************');
      console.log(accessToken);
      console.log('****************');
    });
  });
}

// make the login request:
var request = https.request(httpsRequestOptions, saveToken);	// start it
request.write(loginData);                       // add  body of  POST request
request.end();

```
* We can also choose one equipment, and get its data in real time

first, we get one equipment id, construct the `url` for https request, make the https request, and in the end, reset the `httpsRequestOptions`.

```javascript
    // construct url
    // get the data of one equipment for the last 3 minutes
    var toTime = new Date();
    toTime.setHours(toTime.getHours());
    var fromTime = new Date(toTime);

    var durationInMinutes = 3;
    console.log(toTime);
    console.log(fromTime);
    fromTime.setMinutes(toTime.getMinutes() - durationInMinutes);

    var url = '/api/equipment/a40be1ed-5a9d-4b35-b500-0aff698e8c79/data/?fromTime=' +
    fromTime.toISOString() +
    '&toTime=' +
    toTime.toISOString() +
    '&interval=min';

    getInfo(url, accessToken);
    console.log(result);

    // reset httpsRequestOptions
    httpsRequestOptions.path = '/o/token/';
    httpsRequestOptions.method = 'POST';
    httpsRequestOptions.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': loginData.length
    }
    
```

## Express
* How to install Express?
`$ npm install express`

* Add express to the `client.js`
```javascript
var express = require('express'); // include the express library
var server = express();           // create a server using express
var message = "Hello Client!"

// start the server:
server.listen(8080);

server.use('/', express.static('public'));   // set a static file directory

// send message to the client
function handleRequest(request, response) {
  response.send(message);         // send message to the client
  response.end();                 // close the connection
}

// define what to do when the client requests `/data`:
server.get('/data', handleRequest);         // GET request
```
* At this point, the `client.js` is complete.

## Visualization using p5
* Add a `public` folder with an empty p5 sketch template
* In the sketch.js, use `loadJSON` method to get data from `http://localhost:8080/data` every 10 seconds.
* parse data into `device`, `time`, `usage`, and make a chart.

* Another p5 example is in the `enertive_p5_static_json` folder
[demo](http://alpha.editor.p5js.org/mathura/sketches/Sy86Na7-x)

## References
* [enertiv bitbucket](https://bitbucket.org/enertiv/enertiv-client/)
* [enertiv endpoints](https://api.enertiv.com/docs/)

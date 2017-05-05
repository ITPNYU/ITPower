/*
	HTTP/HTTPS request example to Enertiv
  Does basic Oauth2 exchange to get access token
  then makes first API request with the token.
  This is a quick-and-dirty solution, and should be improved upon.
  You'll need to add a file, cred.js, to the same directory as this file,
  with the following in it:
  var creds = {
      username : your_username,
      password : your_password,
      clientID : your_client_id,
      clientSecret : your_client_secret
  }
  module.exports = creds;
  to call it from the command line:
  node client.js
  TODO:
    * Simplify with async.js or q.js or an oauth2 library
	created 25 Feb 2015
  updated 20 Nov 2015
	by Tom Igoe
*/


var https = require('https');
var querystring = require('querystring');

var express = require('express'); // include the express library
var server = express();           // create a server using express
var message = "Hello Client!"

// start the server:
server.listen(8080);

server.use('/', express.static('public'));   // set a static file directory

function handleRequest(request, response) {
  response.send(message);         // send message to the client
  response.end();                 // close the connection
}

// define what to do when the client requests something:
server.get('/data', handleRequest);         // GET request

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
      // update message
      message = clientData;
      console.log('****************');
      console.log(accessToken);
      console.log('****************');
    });
  });
}

// make the login request evey 10 sec:
setInterval(function() {
  var request = https.request(httpsRequestOptions, saveToken);	// start it
  request.write(loginData);                       // add  body of  POST request
  request.end();
  console.log('Hello');
}, 10000);

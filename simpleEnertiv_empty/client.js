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

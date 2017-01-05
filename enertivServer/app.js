/******************************************************
FILE CONTAINS ALL THE ENDPOINTS POSSIBLE
Endpoints are explained above their definition

Available endpoints -
/login
/kitchen
/shop
/physcomp
/classrooms
/floordata_itp

created 15 Apr 2016 by Mathura MG
******************************************************/

var express = require('express');
var moment = require('moment');
var client1 = require('./client.js');
var cors = require('cors');
var equipmentObject = require('./equipment.js');

//FILE TO GET THE DATA ON ITP FLOOR GIVEN A TIME RANGE
var floorObject = require('./floorData.js');

var https = require('https');
var http = require('http');

https.globalAgent.maxSockets = 10;
http.globalAgent.maxSockets = 10;

var app = express();
var c = new client1;

var noComplete = 0;


//To use static HTML pages
app.use(express.static('public'));
app.use(cors());

// Examples using Enertiv node module with Express
// See https://api.enertiv.com/docs/#!/api/ for available endpoints

/*
	*
	*		Important Info
	*
	*		Must hit '/login' first to authenticate
	*			- Follow setup in 'client.js'
	*		Most API endpoints use client info (client/location uuid)
	*		So, use '/client' to save that info for later use
	*
*/


// A couple boxes to push our API responses into
var clientData = {};
var topData = [];
var energyData = [];
var equipData = [];


// Hit this first to authenticate and get current data
app.get('/login', function (req,res){
	if(req.query.loginId)
	{
		console.log('login is -- ' + req.query.loginId);
			console.log(process.env.ENERTIV_PERSONAL_PASSWORD);
		if(!req.query.loginId.localeCompare( process.env.ENERTIV_PERSONAL_PASSWORD))
		{

			var data = c.login(function (data){
				console.log("YOU ARE AUTHENTICATED");
				res.send(data);
			});
		}
		else{
			res.send('YOU ARE NOT AUTHORIZED');
		}
	}
	else{
		res.send('YOU ARE NOT AUTHORIZED');
	}
});


//*****************************************
// ROOMS THAT ARE PRESENT BELOW - get data for last 24 hours
//  1) KITCHEN
//  2) SHOP
//  3) PCOMP
//	4) CLASSROOMS - Room 20,15,50 Meeting room, Conf Room
//
//*****************************************

//*****************************************
//
// 								KITCHEN
//
//*****************************************
app.get('/kitchen', function (req,res){

	//console.log('potato');

	var apiClient = c.apiCall('/api/client/', function (apiClient){

		var clientInfo = JSON.parse(apiClient);
		console.log(clientInfo);
		clientData.uuid = clientInfo[0].id;

		var kitchenLocationId = 'efa01903-ca25-4501-9920-d34fa61de5e9';

		var locations = [kitchenLocationId];
		equipmentObject.getEquipmentFromLocations(locations,res,c);

	});
});

//*****************************************
//
// 								SHOP
//
//*****************************************
// Go to this link to get data for shop
app.get('/shop', function (req,res){

	//console.log('potato');

	var apiClient = c.apiCall('/api/client/', function (apiClient){

		var clientInfo = JSON.parse(apiClient);
		console.log(clientInfo);
		clientData.uuid = clientInfo[0].id;

		var shopLocationId = 'b121b9e6-44e6-40b3-b787-ee667bfa084d';

		var locations = [shopLocationId];
		equipmentObject.getEquipmentFromLocations(locations,res,c);

	});
});

//*****************************************
//
// 								PCOMP
//
//*****************************************
app.get('/physComp', function (req,res){

	//console.log('potato');

	var apiClient = c.apiCall('/api/client/', function (apiClient){

		var clientInfo = JSON.parse(apiClient);
		console.log(clientInfo);
		clientData.uuid = clientInfo[0].id;

		var physCompLocationId = 'ce007293-7a34-4a61-80a1-d92312e6cfa9';
		var locations = [physCompLocationId];
		equipmentObject.getEquipmentFromLocations(locations,res,c);

	});
});

//*****************************************
//
// 					CLASSROOM -ROOM 20
//
//*****************************************
app.get('/classrooms', function (req,res){

	var apiClient = c.apiCall('/api/client/', function (apiClient){

		var clientInfo = JSON.parse(apiClient);
		console.log(clientInfo);
		clientData.uuid = clientInfo[0].id;

		var room20LocationId = '2b9e3545-b62f-4b9f-9053-254b99e14c9c';
		var room15LocationId = 'd0b102ee-e0a4-40f6-9795-ab8745f0ef33';
		var room50LocationId = '773eece8-c7c6-425a-9d4f-93a2c4954c66';
		var meetingRoomLocationId = '80a0c045-1f6e-4b8c-96a3-5d2865ea5f6e';
		var conferenceRoomLocationId = '4b6a1f2e-b40d-4cc6-8119-217259a75249';

		var locations = [room20LocationId,
										room15LocationId,
										room50LocationId,
										meetingRoomLocationId,
										conferenceRoomLocationId]
		equipmentObject.getEquipmentFromLocations(locations,res,c);

	});
});


	//*****************************************
	//
	// 		GENERIC APIs FOR THE FLOOR
	//		For project by Viniyata and Mathura
	//
	//*****************************************

//*****************************************
//
// 		/floordata_itp
//		IP : 'from_time' from when data is required
//					'sublocationId' not compulsory
//					'equipmentId' not compulsory
//		OP : Room name
//				energy per room
//				Total floor energy
//
//*****************************************
app.get('/floordata_itp', function (req,res){

	var apiClient = c.apiCall('/api/client/', function (apiClient){

		var clientInfo = JSON.parse(apiClient);
		console.log(clientInfo);
		var location = clientInfo[0].locations[0];
		console.log(location);
		var noOfAPICompleted;
		var startTime;
		var endTime;
		var apiType;
		var roomsInFloorDataURL

		if(req.query.startTime)
		{
			noOfAPICompleted = 0;
			startTime = req.query.startTime;
			if(req.query.endTime) {
				endTime = req.query.endTime;
			} else {
				endTime = moment().format();
			}

			if(req.query.equipmentId)
			{
				apiType='equipment';
				idForAPI = req.query.equipmentId.split(',');;
			}
			else if(req.query.sublocationId)
			{
				apiType = 'sublocation';
				console.log(req.query.sublocationId);
				idForAPI = req.query.sublocationId.split(',');
				console.log(idForAPI);
				console.log(idForAPI[0]);
				console.log(idForAPI[1]);
			}
			else
			{
				apiType = 'location';
				idForAPI = [location];
			}

			dataReturnedFromAPI = floorObject.getFloorData(startTime, endTime, idForAPI,c,res,apiType,noOfAPICompleted);

		}
	});
});

//*****************************************
//
// 		/schema_itp
//		IP : NONE
//		OP : sublocation
//				 equipments in sublocation
//
//*****************************************
app.get('/schema_itp', function (req,res){

	var apiClient = c.apiCall('/api/client/', function (apiClient){

		var clientInfo = JSON.parse(apiClient);
		console.log(clientInfo);
		var location = clientInfo[0].locations[0];
		console.log(location);

		var url = '/api/location/' + location + '/sublocation/'

		var schema = c.apiCall(url, function(schema){
			res.send(schema);
		});
	});
});




// Start our server
var server = app.listen(process.env.PORT || 5000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('app listening at http://%s:%s', host, port);
});

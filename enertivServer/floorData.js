/******************************************************
FILE TO GET THE DATA ON ITP FLOOR GIVEN A TIME RANGE
created 20 Apr 2016 by Mathura MG
******************************************************/

// Depending on the time entered by the person, the api will call the proper time intervals
// if <= 2 days - run in minutes only
// if > 2 days and <= 7 days - run in 15 min + min
// if > 7 days and <= 100 days - run in hours + 15 min(?) + min
// if > 100 days and <= 1 yr - run in days

//Caveats :
// For 'day' the API runs from 4/5 AM UTC
// For 'hour' the API runs from 00:00 of the hour starting after current time. I
// I.e if you want to run from 23:12 - 9:07 next day, it will give data only for 23:00 - 9:00
// For '15min' the API runs from the start time minute, but only till the 15 min block ends. I.e, if you run 15 min for a 20 min block, it will give data only of the first 15 minutes.
// ADDITIONAL Caveat - Although 15 min runs from the start time, it WILL NOT give data unless it starts at 00,15,30,45
// 'min' is peaceful.

//What does apiDuration variable indicate?
//apiDuration is a variable that indicates what time interval the power data is returned at.
//This allows in easy calculation of energy

var moment = require('moment');

var durationDay = 24;
var durationHour = 1;
var duration15Min = 0.25;
var duration1Min = 0.0166667;

var noComplete;
var totalEnergy = 0;
fullRoomData = [];

module.exports = {


  getFloorData: function(startTime, endTime, idForAPI,c,res, apiType,noOfAPICompleted)
  {
    var totalData = [];
    var roomIds = [];
    var that = this;
    console.log('in here -- getting floor data');

    var startTimeFormatted = startTime.toString().substring(0,19)+'Z';
    var endTimeFormatted = endTime.toString().substring(0,19)+'Z';

    var endTime = moment(new Date(endTime)); //todays date
    var startTime = moment(new Date(startTime)); // another date

    var duration = moment.duration(endTime.diff(startTime));

    var hourDiff = duration.asHours();
    var minDiff = duration.asMinutes();
    var secDiff = duration.asSeconds();

    console.log('time difference is -- hours -- ' + hourDiff + ' : min -- ' + minDiff + ' : sec -- ' + secDiff);

    /*****************************************
        if <= 2 days - run in minutes only
    *****************************************/
    if(minDiff <= 2880)
    {
      fullRoomData = [];
      noComplete = 0;
      totalEnergy = 0;
      noOfAPICompleted = 0;
      var detailOfRoomUrl = [];
      for(var a =0; a<idForAPI.length;a++)
      {
        detailOfRoomUrl[0] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + startTimeFormatted +'&toTime='+ endTimeFormatted + '&interval=min&cost=false';

        var apiDuration = [duration1Min];
        for(var i=0;i<detailOfRoomUrl.length;i++)
        {
          that.getPowerEnergyNumbers(detailOfRoomUrl[i], apiDuration[i],c, detailOfRoomUrl.length,res,noOfAPICompleted,totalData,a,idForAPI.length,idForAPI[a],roomIds);
        }
      }
    }
    /*****************************************
    if > 2 days and <= 7 days - run in 15 min + min
    *****************************************/
    else if(minDiff > 2880 && minDiff<=10080 )
    {
      var detailOfRoomUrl = [];
      fullRoomData = [];
      var roomData ;
      noComplete = 0;
      var orgStartTime = startTime;
      var orgStartTimeFormatted = orgStartTime.toISOString().substring(0,19)+'Z'
      var orgEndTime = endTime;
      var orgEndTimeFormatted = orgEndTime.toISOString().substring(0,19)+'Z';
      totalEnergy = 0;

      // data in 15 min
      var minTemp = startTime.get('minute');
      if(minTemp>0&&minTemp<=15)
      {
        startTime.minutes(15);
      }
      else if(minTemp>15&&minTemp<=30)
      {
        startTime.minutes(30);
      }
      else if(minTemp>30&&minTemp<=45)
      {
        startTime.minutes(45);
      }
      else if(minTemp>45)
      {
        startTime.minutes(0);
        startTime.add(1,'hour');
      }

      minTemp = endTime.get('minute');
      if(minTemp>=0&&minTemp<15)
      {
        endTime.minutes(0);
      }
      else if(minTemp>=15&&minTemp<30)
      {
        endTime.minutes(15);
      }
      else if(minTemp>=30&&minTemp<45)
      {
        endTime.minutes(30);
      }
      else if(minTemp>=45)
      {
        endTime.minutes(45);
      }

      endTimeFormatted = endTime.toISOString().substring(0,19)+'Z';
      startTimeFormatted = startTime.toISOString().substring(0,19)+'Z';

      console.log(' -- ' + startTimeFormatted + ' -- ' + endTimeFormatted + ' -- ');
      console.log(' -- ' + orgStartTimeFormatted + ' -- ' + startTimeFormatted + ' -- ');
      console.log(' -- ' + endTimeFormatted + ' -- ' + orgEndTimeFormatted + ' -- ' );

      for(var a =0; a<idForAPI.length;a++)
      {
        detailOfRoomUrl[0] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + startTimeFormatted +'&toTime='+ endTimeFormatted + '&interval=15min&cost=false';

        //data in 1 min for the beginning data
        detailOfRoomUrl[1] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + orgStartTimeFormatted +'&toTime='+ startTimeFormatted + '&interval=min&cost=false';

        //data in 1 min for the trailing data
        detailOfRoomUrl[2] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + endTimeFormatted +'&toTime='+ orgEndTimeFormatted + '&interval=min&cost=false';

        var apiDuration = [duration15Min, duration1Min, duration1Min];
        for(var i=0;i<detailOfRoomUrl.length;i++)
        {
          that.getPowerEnergyNumbers(detailOfRoomUrl[i], apiDuration[i],c, detailOfRoomUrl.length,res,noOfAPICompleted,totalData,a,idForAPI.length,idForAPI[a],roomIds);
        }
      }
    }
    /*****************************************
    if > 7 days and <= 30 days - run in hours +  min
    *****************************************/
    else if(hourDiff > 168 && hourDiff <= 720 )
    {
      var detailOfRoomUrl = [];
      fullRoomData = [];
      var roomData ;
      noComplete = 0;
      var orgStartTime = startTime;
      var orgStartTimeFormatted = orgStartTime.toISOString().substring(0,19)+'Z';
      var orgEndTime = endTime;
      var orgEndTimeFormatted = orgEndTime.toISOString().substring(0,19)+'Z';
      var totalEnergy = 0;
      // data in hours min
      var minTemp = startTime.get('minute');
      if(minTemp>0)
      {
        startTime.minutes(0);
        startTime.add(1,'hour');
      }

      minTemp = endTime.get('minute');
      if(minTemp>0)
      {
        endTime.minutes(0);
      }

      endTimeFormatted = endTime.toISOString().substring(0,19)+'Z';
      startTimeFormatted = startTime.toISOString().substring(0,19)+'Z';

      console.log(' -- ' + startTimeFormatted + ' -- ' + endTimeFormatted + ' -- ');
      console.log(' -- ' + orgStartTimeFormatted + ' -- ' + startTimeFormatted + ' -- ');
      console.log(' -- ' + endTimeFormatted + ' -- ' + orgEndTimeFormatted + ' -- ' );
      for(var a =0; a<idForAPI.length;a++)
      {
        detailOfRoomUrl[0] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + startTimeFormatted +'&toTime='+ endTimeFormatted + '&interval=hour&cost=false';

        //data in 1 min for the beginning data
        detailOfRoomUrl[1] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + orgStartTimeFormatted +'&toTime='+ startTimeFormatted + '&interval=min&cost=false';

        //data in 1 min for the trailing data
        detailOfRoomUrl[2] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + endTimeFormatted +'&toTime='+ orgEndTimeFormatted + '&interval=min&cost=false';

        var apiDuration = [durationHour, duration1Min, duration1Min];
        for(var i=0;i<detailOfRoomUrl.length;i++)
        {
          that.getPowerEnergyNumbers(detailOfRoomUrl[i], apiDuration[i],c, detailOfRoomUrl.length,res,noOfAPICompleted,totalData,a,idForAPI.length,idForAPI[a],roomIds);
        }
      }
    }
    /*****************************************
      if > 30 days and <= 1 yr - run in days and then hours and minutes
    *****************************************/
    else if(hourDiff > 720 && hourDiff <= 45260 )
    {
      var detailOfRoomUrl = [];
      fullRoomData = [];
      var roomData ;
      noComplete = 0;
      var orgStartTime = startTime;
      var orgStartTimeFormatted = orgStartTime.toISOString().substring(0,19)+'Z';
      var orgEndTime = endTime;
      var orgEndTimeFormatted = orgEndTime.toISOString().substring(0,19)+'Z';
      var hourStartTime = startTime;
      var hourEndTime = endTime;
      var minTemp = startTime.get('minute');
      var totalEnergy = 0;

      if(minTemp>0)
      {
        console.log('test -- ' + startTime);
        startTime.add(1, 'hour');
        startTime.minutes(0);
        console.log('test -- ' + startTime);
      }

      minTemp = endTime.get('minute');
      if(minTemp>0)
      {
        endTime.minutes(0);
      }

      var endTimeFormatted = endTime.toISOString().substring(0,19)+'Z';
      var startTimeFormatted = startTime.toISOString().substring(0,19)+'Z';
      var tempEndTimeFormatted = String(endTimeFormatted);
      var tempStartTimeFormatted = String(startTimeFormatted);

      console.log(' -- ' + tempStartTimeFormatted + ' -- ' + tempEndTimeFormatted + ' -- ');
      console.log(' -- ' + orgStartTimeFormatted + ' -- ' + tempStartTimeFormatted + ' -- ');
      console.log(' -- ' + tempEndTimeFormatted + ' -- ' + orgEndTimeFormatted + ' -- ' );



      hourTemp = startTime.get('hour');
      if(hourTemp>0)
      {
        console.log('test -- ' + startTime);
        startTime.add(1, 'day');
        startTime.hours(0);
        console.log('test -- ' + startTime);

      }

      hourTemp = endTime.get('hour');
      if(hourTemp>0)
      {
        endTime.hours(0);
      }

      endTimeFormatted = endTime.toISOString().substring(0,19)+'Z';
      startTimeFormatted = startTime.toISOString().substring(0,19)+'Z';

      console.log(' -- ' + startTimeFormatted + ' -- ' + endTimeFormatted + ' -- ');
      console.log(' -- ' + orgStartTimeFormatted + ' -- ' + startTimeFormatted + ' -- ');
      console.log(' -- ' + endTimeFormatted + ' -- ' + orgEndTimeFormatted + ' -- ' );
      for(var a =0; a<idForAPI.length;a++)
      {

      //data in days for the data
        detailOfRoomUrl[0] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + startTimeFormatted +'&toTime='+ endTimeFormatted + '&interval=day&cost=false';

        //data in hours for the beginning data
        detailOfRoomUrl[1] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + orgStartTimeFormatted +'&toTime='+ startTimeFormatted + '&interval=hour&cost=false';

        //data in hours for the trailing data
        detailOfRoomUrl[2] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + endTimeFormatted +'&toTime='+ orgEndTimeFormatted + '&interval=hour&cost=false';

        //data in 1 min for the beginning data
        detailOfRoomUrl[3] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + orgStartTimeFormatted +'&toTime='+ tempStartTimeFormatted + '&interval=min&cost=false';

        //data in 1 min for the trailing data
        detailOfRoomUrl[4] = '/api/'+apiType+'/' + idForAPI[a] + '/data/?fromTime=' + tempEndTimeFormatted +'&toTime='+ orgEndTimeFormatted + '&interval=min&cost=false';

        var idid = idForAPI[a];
        var apiDuration = [durationDay,durationHour,durationHour, duration1Min, duration1Min];
        for(var i=0;i<detailOfRoomUrl.length;i++)
        {

          that.getPowerEnergyNumbers(detailOfRoomUrl[i], apiDuration[i],c, detailOfRoomUrl.length,res,noOfAPICompleted,totalData,a,idForAPI.length,idForAPI[a],roomIds);
        }
      }
    }

    else
    {
      res.send(1);
    }
  },

  getPowerEnergyNumbers: function( url, apiDuration, c, noOfUrl,res,noOfAPICompleted,totalData,apiIndex,totalNoOfId,id,roomIds) {
    var that = this;
    totalData[apiIndex] = [];
    roomIds[apiIndex] = id;
    roomData = c.apiCall(url, function(roomData){
      noComplete++;
      console.log('apiIndex is -- ' + apiIndex + ' -- '  + id);
      //console.log(fullRoomData);
      fullRoomData.push(roomData);
      totalData[apiIndex].push(roomData);
      console.log(url);

      console.log('no complete -- ' + noComplete + ' -- no of url -- ' + noOfUrl);


      var tempTotalData = [];
      if(noComplete == noOfUrl*totalNoOfId)
      {
        console.log(' no of calls complete -- ' + noComplete);
        //console.log(totalData);
        for(var j =0;j<totalData.length;j++)
        { totalEnergy = 0;
          totalEnergy += that.calculateEnergy(JSON.parse(totalData[j][0]).data,apiDuration);
          var a = JSON.parse(totalData[j][0]);
          for(var i=1;i<noOfUrl;i++)
          {
            var temp = JSON.parse(totalData[j][i]);
            a.data = a.data.concat(temp.data);
            totalEnergy += that.calculateEnergy(JSON.parse(totalData[j][i]).data,apiDuration);
          }
          noOfAPICompleted++;
          console.log('check check -- '+noOfAPICompleted);
          tempTotalData[j] = {
            "data" : a,
            "totalEnergy" : totalEnergy,
            "id": roomIds[j]
          };
        }

        res.send(tempTotalData);
      }
      else
      {}
    });
  },


  calculateEnergy: function(data,apiDuration) {
    var total = 0;

    console.log('calculating the energy');
    //console.log(data);
    if(data.length>0)
    {
      var keyName =  Object.keys(data[0])[1];
      console.log(('keyname is -- ' + keyName));
      for(var i =0;i<data.length;i++){
        total += (data[i][keyName]);
      }
      total = total*apiDuration;
      console.log('total energy is -- ' + total );
      return total;
    }
  }

}

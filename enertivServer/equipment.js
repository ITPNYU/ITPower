module.exports = {

  getEquipmentFromLocations: function(locationIds,res,c)
  {
    var locationCount = 0;
    var allEquipmentIds = [];

    var that = this;

    var equipmentResponse = [];
    //variable to collect all the ids
    var equipmentIds = [];
    var totalRoomEnergy = [];

    for(var i =0;i <locationIds.length; i++)
    {
      var equipFromSublocationUrl = '/api/sublocation/'+ locationIds[i] +'/equipment/';

      var equipmentsInShop = c.apiCall(equipFromSublocationUrl, function(equipmentsInShop){
        var parsedData = JSON.parse(equipmentsInShop);
        for(var j=0;j<parsedData.length;j++)
        {
          allEquipmentIds.push(parsedData[j]["id"]);
          console.log('doing for location no -- ' + j + ' -- ' + locationIds[j] );
        }
        locationCount++;

        if( locationCount == (locationIds.length) )
        {
          console.log('The total count is -- ' + allEquipmentIds.length );
          var noOfHours = 24;

          var endTime = new Date();
          //endTime.setHours(23);
          //endTime.setMinutes(0);
          endTime.setSeconds(0);

          //	var endTime = new Date(2016,03,10,23,00,00);
          var endTimeFormatted = endTime.toISOString().substring(0,19)+'Z';

          var startTime =  new Date( endTime.getTime() - noOfHours*60*60*1000);
          var startTimeFormatted = startTime.toISOString().substring(0,19)+'Z';
          console.log('the time that is showing is')
          console.log(startTimeFormatted);
          console.log(endTimeFormatted);

          for(var k=0;k<allEquipmentIds.length;k++)
          {
            console.log('making call for equipment -- ' + k + ' -- ' + allEquipmentIds[k]);
            that.getEquipmentData(i, allEquipmentIds[k],c,equipmentResponse,allEquipmentIds.length,res, startTimeFormatted, endTimeFormatted, totalRoomEnergy);
          }
        }
      });
    }



  },

  // for(var i=0;i<parsedData.length;i++)
  // {
  //   equipmentIds[i] = parsedData[i]["id"];
  //   that.getEquipmentData(i, equipmentIds[i],c,equipmentResponse,equipmentLength,res, startTimeFormatted, endTimeFormatted
  //   );
  // }
  sayHello: function() {
    console.log('saying hello');
  },

  getEquipmentData: function(index, equipmentId, c, equipmentResponse, noOfEquipments,res, startTimeFormatted, endTimeFormatted, totalRoomEnergy)
  {
    var currTime = new Date();
    var currentHour = currTime.getUTCHours();
    var currentMinute = currTime.getUTCMinutes();

    var diff;
    var changeStart;
    var changeEnd;
    var changeDur;
    var isDay;

    currentHour = (currentHour -4)%24;
    if(currentHour<0)
    {
      currentHour = currentHour+24;
    }


    if(currentHour >= 9 && currentHour <= 24 )
    {
      isDay = 1;
      changeDur = 540; //indicates how long it is nighttime
      diff = ((currentHour-9)*60 + currentMinute);
      changeEnd = 1440 - diff;
      changeStart = changeEnd - changeDur;
    }
    else
    {
      isDay = 0;
      changeDur = 900;  //indicates how long it is daytime
      diff = ((currentHour)*60 + currentMinute);
      changeEnd = 1440 - diff;
      changeStart = changeEnd - changeDur;
    }
	  var detailOfEquipmentUrl = '/api/equipment/' + equipmentId + '/data/?fromTime=' + startTimeFormatted +'&toTime='+ endTimeFormatted + '&interval=min&cost=false';

    var equipmentData = c.apiCall(detailOfEquipmentUrl, function(equipmentData){
  		var parsedData = JSON.parse(equipmentData);
      //console.log(parsedData);
      if(parsedData.data.length>0)
      {
    		var keyName = Object.keys(parsedData.data[0])[1];
        var timeVar = Object.keys(parsedData.data[0])[0];

        if(keyName.localeCompare('x') == 0 )
        {

        }
        else
        {

          console.log('obtaining data for -- ' + keyName );
          var equipmentEnergy = [];
          var totalEnergyOffPeak = 0;
          var totalEnergyPeak = 0;
          console.log('data length is -- ' + parsedData.data.length);
          for(var i =0;i<parsedData.data.length;i++)
          {
            equipmentEnergy[i] = {x:parsedData.data[i][timeVar],y:parsedData.data[i][keyName]*1000};
            if(isDay ==1)
            {
              if(i>= changeStart && i< changeEnd)
              {
                totalEnergyOffPeak += parsedData.data[i][keyName]*1000/60;

              }
              else
              {
                totalEnergyPeak += parsedData.data[i][keyName]*1000/60;
              }
            }
            else
            {

              if(i>= changeStart && i< changeEnd)
              {
                totalEnergyPeak += parsedData.data[i][keyName]*1000/60;
              }
              else
              {
                totalEnergyOffPeak += parsedData.data[i][keyName]*1000/60;
              }
            }

            if(!totalRoomEnergy[i])
            {
              totalRoomEnergy[i] = {x:parsedData.data[i][timeVar],y:parsedData.data[i][keyName]*1000};
            }
            else
            {
              totalRoomEnergy[i].y += parsedData.data[i][keyName]*1000;
            }

          }
          equipmentResponse.push({name:keyName,value: equipmentEnergy,totalEnergyOffPeak: totalEnergyOffPeak, totalEnergyPeak: totalEnergyPeak});
        }

      }
      else{

      }

      if(equipmentResponse.length == noOfEquipments-1)
      {

        var totalRoomEnergyPeak = 0;
        var totalRoomEnergyOffPeak = 0;
        for(var i =0;i<equipmentResponse.length;i++)
        {
          totalRoomEnergyPeak += equipmentResponse[i].totalEnergyPeak;
          totalRoomEnergyOffPeak += equipmentResponse[i].totalEnergyOffPeak;
        }

        equipmentResponse.push({name:'roomTotal',value: totalRoomEnergy,totalEnergyOffPeak: totalRoomEnergyOffPeak, totalEnergyPeak: totalRoomEnergyPeak});

        res.send({
          'data':equipmentResponse,
          'isDay' : isDay,
          'range' : [changeStart,changeEnd]
        });
      }
      else{

      }

  	});


  }
};

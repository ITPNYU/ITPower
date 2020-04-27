/*

This sketch gets data from ITP Weather DB, saves them into arrays, and display the most recent data on the canvas.
Please refer to https://github.com/brondle/itpower-weather-server for all the url endpoints. 

Notes: The time is in UTC so you want to do -4 to convert it to EST.

This sketch is an example sketch written for ITP Weather Band by Arnab and Yeseul.Thanks to Brent for setting up the DB and Tom for resources & support.

April 2020

*/

//curl -X GET -d macAddress={weatherstationMacAddress} -d sessionKey={weatherstationSessionKey} https://{url}/itpower-data

let url = 'https://tigoe.io/itpower-data';
let macID = '';
let sessionKey = '';

// make arrays to save each weather data
let wind_dir = [];
let winddir_avg2m = [];
let windspeedmph = [];
let rainin = [];
let dailyrainin = [];
let temperature = [];
let humidity = [];
let pressure = [];
let illuminance = [];
let uva = [];
let uvb = [];
let uvindex = [];
let recorded_at= [];


function preload() {
  
  path = url + "?macAddress=" + macID + "&sessionKey=" + sessionKey;
  httpDo(path, 'GET', readResponse);

}


function setup() {
  
  createCanvas(600, 600);

}


function draw() {
  
  background(200);
  textSize(12);
  fill(0);
  noStroke();
  
  // display the most recent data
  displayRecentData(50, 50, 20);    

}


function readResponse(response) {

  // get response as a JSON object
  let data = JSON.parse(response);
  
  // parse weather data and save them into each array
  for (i=450; i<data.length; i++) {
    recorded_at.push(data[i].recorded_at);
    wind_dir.push(data[i].wind_dir);
    winddir_avg2m.push(data[i].winddir_avg2m);
    windspeedmph.push(data[i].windspeedmph);
    rainin.push(data[i].rainin);
    dailyrainin.push(data[i].dailyrainin);
    temperature.push(data[i].temperature);
    humidity.push(data[i].humidity);
    pressure.push(data[i].pressure);
    illuminance.push(data[i].illuminance);
    uva.push(data[i].uva);
    uvb.push(data[i].uvb);
    uvindex.push(data[i].uvindex);
  }
  
  // console.log each array
  // console.log(recorded_at);
  // console.log(wind_dir);
  // console.log(winddir_avg2m);
  // console.log(windspeedmph);
  // console.log(rainin);
  // console.log(dailyrainin);
  // console.log(temperature);
  // console.log(humidity);
  // console.log(pressure);
  // console.log(illuminance);
  // console.log(uva);
  // console.log(uvb);
  // console.log(uvindex);      
  
}

function displayRecentData(textX, textY, lineH) {
  
  text('Time (UTC)', textX, textY-5);
  text(recorded_at[recorded_at.length-1], textX+100, textY-5);
  text('wind_dir', textX, textY+lineH);
  text(wind_dir[wind_dir.length-1],textX+100, textY+lineH);
  text('winddir_avg2m',textX, textY+lineH*2);
  text(winddir_avg2m[winddir_avg2m.length-1],textX+100,textY+lineH*2);
  text('windspeedmph',textX, textY+lineH*3);
  text(windspeedmph[windspeedmph.length-1],textX+100, textY+lineH*3);
  text('rainin',textX, textY+lineH*4);
  text(rainin[rainin.length-1],textX+100, textY+lineH*4);
  text('dailyrainin',textX, textY+lineH*5);
  text(dailyrainin[dailyrainin.length-1],textX+100, textY+lineH*5);
  text('temperature',textX, textY+lineH*6);
  text(temperature[temperature.length-1],textX+100, textY+lineH*6);
  text('humidity',textX, textY+lineH*7);
  text(humidity[humidity.length-1],textX+100, textY+lineH*7);
  text('pressure',textX, textY+lineH*8);
  text(pressure[pressure.length-1],textX+100, textY+lineH*8);
  text('illuminance',textX, textY+lineH*9);
  text(illuminance[illuminance.length-1],textX+100, textY+lineH*9);
  text('uva',textX, textY+lineH*10);
  text(uva[uva.length-1],textX+100, textY+lineH*10);
  text('uvb',textX, textY+lineH*11);
  text(uvb[uvb.length-1],textX+100, textY+lineH*11);
  text('uvindex',textX, textY+lineH*12);
  text(uvindex[uvindex.length-1],textX+100, textY+lineH*12);
  
}
// var serverUrl = "https://agile-reef-71741.herokuapp.com";
// var serverUrl = "https://itpenertivserver.herokuapp.com";

var serverUrl = "http://localhost:5000";
var interval = 20000; //in milliseconds

function onSubmit() {
  console.log(document.getElementById('myText').value);
  addEveryInterval(document.getElementById('myText').value);
  document.getElementById('output').innerHTML = '';
}

function addEveryInterval(equipId) {
  var oneMin = 120*1000;
  //call the outlet every 1 minute to check if the number has changed
  setInterval(function(){
    console.log('getting line graph data per minute');
    var now = new Date();
    now.setSeconds(0);
    startTime1 = now - 120*1000 - 5*60*60*1000; // to take care of UTC time
    startTime1 = new Date(startTime1);
    startTime1 = startTime1.toISOString();
    startTime1 = startTime1.slice(0,-5);
    console.log(startTime1);
    var tempUrl = serverUrl + '/floordata_itp?startTime=' + startTime1 + '&equipmentId=' + equipId ;
    console.log(tempUrl);
    $.ajax({
      url: tempUrl,
      async: false,
      success: function(result){
        console.log('here is the result');
        console.log(result);
        var key = result[0].data.names[0];
        var d = new Date();
        var elt = document.createElement('p');

        elt.innerHTML += result[0].data.data[0].x + ' - ' + result[0].data.data[0][key];
        document.getElementById('output').appendChild(elt);
        document.getElementById('output-eq').innerHTML = key;
        }
      })
  }, interval);

}

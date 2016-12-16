var formatYear = d3.timeParse("%Y-%m-%dT%H:%M:%S%Z");
var occup_key = {};
function createOccupKey() {
  for (var i =0;i<occup_data.length;i++) {
    occup_key[formatYear(occup_data[i].x)] = occup_data[i].open;
  }
}

function createDiv() {
  for(var i = 0 ; i< data.length; i ++)
  {
    var elt = document.createElement('div');
    elt.id = "text-" + i;
    document.getElementsByClassName('jumbotron')[0].appendChild(elt);
    elt = document.createElement('svg');
    elt.id = "visualisation-" + i;
    elt.setAttribute("width","2000");
    elt.setAttribute("height","500");
    document.getElementsByClassName('jumbotron')[0].appendChild(elt);
  }
}

function InitChart() {
  var floorEnergy = 0;
  var floorEnergyWasted = 0;
  for(var i = 0 ; i< data.length; i ++)
  {
    var totalEnergy = 0;
    var totalEnergyWasted = 0;
    var temp = 'text-' + i;
    var key = data[i]["data"]["names"][0];
    document.getElementById(temp).innerHTML = data[i]["name"];
    var id = "#visualisation-" + i;
    var yMin = d3.min(data[i]["data"]["data"], function (d) { return d[key]; }),
    yMax = d3.max(data[i]["data"]["data"], function (d) { return d[key]; });

    var vis = d3.select(id),
        WIDTH = 2000,
        HEIGHT = 500,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 50
        },
        xScale = d3.time.scale().range([MARGINS.left, WIDTH - MARGINS.right]).domain([formatYear("2016-10-20T00:00:00Z"),formatYear("2016-11-21T00:00:00Z")]),

        yScale = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([0, yMax+0.1]),

        xAxis = d3.svg.axis()
        .scale(xScale),

        yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    vis.append("svg:g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
        .call(xAxis);
    vis.append("svg:g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (MARGINS.left) + ",0)")
        .call(yAxis);
    var lineGen = d3.svg.line()
        .x(function(d) {
            return xScale(d3.time.hour.offset(formatYear(d.x), -5));
        })
        .y(function(d) {
            totalEnergy += d[key];

            if(occup_key[d3.time.hour.offset(formatYear(d.x), -5)]===0) {
              totalEnergyWasted += d[key];
            }
            return yScale(d[key]);
        })
        .interpolate("basis");

    var lineGen1 = d3.svg.line()
        .x(function(d) {
            return xScale(formatYear(d.x));
        })
        .y(function(d) {

            return yScale(d.open*yMax);
        })
        .interpolate("basis");

      vis.append('svg:path')
          .attr('d', lineGen(data[i]["data"]["data"]))
          .attr('stroke', 'blue')
          .attr('stroke-width', 2)
          .attr('fill', 'none');

      vis.append('svg:path')
        .attr('d', lineGen1(occup_data))
        .attr('stroke', 'green')
        .attr('stroke-width', 1)
        .attr('fill', 'none');

      floorEnergy += totalEnergy;
      floorEnergyWasted += totalEnergyWasted;
      document.getElementById(temp).append(" - " +totalEnergy.toFixed(2) + " kWh");
      document.getElementById(temp).append(" - " +totalEnergyWasted.toFixed(2) + " kWh");
    }
    document.getElementById('floorEnergy').innerHTML = "Total Energy - " + floorEnergy.toFixed(2) + " kWh";
    document.getElementById('floorEnergyWasted').innerHTML = "Total Energy used in off hours - " + floorEnergyWasted.toFixed(2) + " kWh";

}
window.onload = function() {
  createDiv();
  // debugger;
  createOccupKey();
  InitChart();
}

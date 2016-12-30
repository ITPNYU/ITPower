var serverUrl = "https://agile-reef-71741.herokuapp.com";//"https://agile-reef-71741.herokuapp.com";
// var selectedTimeRange = [];
// function makeAjaxCallLineGraph(){
//   var serverUrl = "https://agile-reef-71741.herokuapp.com";
//   $.ajax({
//
//     url: serverUrl + '/login?loginId=horsetrunk12',
//     async: false,
//     success: function(result){
//       console.log('LOGGED IN');
//
//     },
//     error: function(result){
//       console.log(result);
//     }
//   }).done(function(){
//     // var now = new Date();
//     var now = new Date('2016-11-11 00:00:00Z');
//     // now.setHours(13);
//     now.setMinutes(0);
//     now.setSeconds(0);
//     startTime = now - 24*60*60*1000;// - 4*60000*60; //temp hack for EST. Conert to moment js - 4*60000*60
//     startTime = new Date(startTime);
//     startTime = startTime.toISOString();
//     startTime = startTime.slice(0,-5);
//     var serverUrl = "https://agile-reef-71741.herokuapp.com";
//     $.ajax({
//
//       url: serverUrl + '/floordata_itp?startTime=' + startTime ,
//       async: false,
//       success: function(result){
//         // console.log(accumData);
//         // accumData = parseTempData(tempAccumData);
//         // accumData = accumData.concat(parseData(result));
//         accumData = parseData(result);
//         // for(var i=0;i<1;i++){
//         //   data = data.concat(data)
//         // }
//
//         // console.log(JSON.stringify(accumData));
//         // console.log(JSON.parse(JSON.stringify(accumData)));
//
//         console.log('start mapping at -- ' + new Date());
//         drawLineGraph();
//         console.log('finish mapping at -- ' + new Date());
//         // addEveryMinute();
//         //get heat map here
//
//
//       }
//     })
//   });
// }
//
// function parseData(result){
//   var parsedData = [];
//   var rawData = result[0].data.data;
//   for(var i =0;i<rawData.length-1;i++){
//     parsedData.push({
//       "date":new Date(rawData[i].x),
//       "val":rawData[i]["NYU ITP"]});
//   }
//   console.log(parsedData);
//   return parsedData;
// }
//
// // parse data
// function parseTempData(result){
//   var parsedData = [];
//   var rawData = result.data;
//   for(var i =0;i<rawData.length;i++){
//     parsedData.push({
//       "date":new Date(rawData[i].x),
//       "val":rawData[i]["Floor 4"]});
//   }
//   return parsedData;
// }
//
//
// function fillData(){
//   for(var i =0;i<1000;i++){
//     var tempDate = new Date(new Date() - i*100*60*60*60);
//     accumData.push({
//       "date":tempDate,
//       "val":(Math.random()*20).toFixed(1)%10
//     });
//   }
// }
//
// function drawLineGraph() {
//
//   //calculate min and max date
//   var minN = d3.min(accumData, function (d) { return d.date; }).getTime(),
//       maxN = d3.max(accumData, function (d) { return d.date; }).getTime();
//   var minDate = new Date(minN),
//       maxDate = new Date(maxN);
//
//   //calculate min and max y
//   var yMin = d3.min(accumData, function (d) { return d.val; }),
//       yMax = d3.max(accumData, function (d) { return d.val; });
//
//   //Draw the main chart
//
//   var margin = {top: 0.05*window.innerHeight, right: 0.09*window.innerHeight, bottom: 0.05*window.innerHeight, left: 0.09*window.innerHeight},
//   width = 0.5*window.innerWidth - margin.left - margin.right;
//   height = 0.4*window.innerHeight - margin.top - margin.bottom;
//
//   plotChart = d3.select('#chart').classed('chart', true).append('svg')
//   .attr('width', width + margin.left + margin.right)
//   .attr('height', height + margin.top + margin.bottom)
//   .append('g')
//   .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
//
//   plotArea = plotChart.append('g')
//   .attr('clip-path', 'url(#plotAreaClip)');
//
//   plotArea.append('clipPath')
//   .attr('id', 'plotAreaClip')
//   .append('rect')
//   .attr({ width: width, height: height });
//
//   //define the x scale
//
//   xScale = d3.time.scale()
//   .domain([minDate, maxDate])
//   .range([0, width]);
//
//   yScale = d3.scale.linear()
//   .domain([0, yMax+5])
//   .range([height, 0]);
//
//   //define the x and y axes
//
//   xAxis = d3.svg.axis()
//   .scale(xScale)
//   .orient('bottom')
//   .ticks(5),
//   yAxis = d3.svg.axis()
//   .scale(yScale)
//   .ticks(4)
//   .orient('left');
//
//   plotChart.append('g')
//   .attr('class', 'line-graph-axis')
//   .attr('transform', 'translate(0,' + height + ')')
//   .call(xAxis);
//
//   plotChart.append('g')
//   .attr('class', 'line-graph-axis-y')
//   .call(yAxis);
//
//   //define the line
//   var lineFunc = d3.svg.line()
//   .x(function(d) {
//     return xScale(new Date(d.date));
//   })
//   .y(function(d) {
//     return yScale(d.val);
//   })
//   .interpolate('basis');
//
//   plotArea.append('svg:path')
//   .attr('d', lineFunc(accumData))
//   .attr('class','line-graph-area')
//
//   // $('.line-graph-area').wrap('<div class="line-graph-area-container"></div>');
//
//
//   //draw the lower chart
//
//   navWidth = width,
//   navHeight = 0.2*window.innerHeight - margin.top - 2*margin.bottom;
//
//   navChart = d3.select('#chart').classed('chart', true).append('svg')
//   .classed('navigator', true)
//   .attr('width', navWidth + margin.left + margin.right)
//   .attr('height', navHeight + margin.top)
//   .append('g')
//   .attr('transform', 'translate(' + margin.left + ',' + 0 + ')');
//
//   // x and y axis for the lower chart
//
//   navXScale = d3.time.scale()
//   .domain([minDate, maxDate])
//   .range([0, navWidth]);
//
//   navYScale = d3.scale.linear()
//   .domain([0, yMax+5])
//   .range([navHeight, 0]);
//
//   //define the x axis
//
//   navXAxis = d3.svg.axis()
//   .scale(navXScale)
//   .ticks(5)
//   .orient('bottom');
//
//   navChart.append('g')
//   .attr('class', 'line-graph-axis')
//   .attr('transform', 'translate(0,' + navHeight + ')')
//   .call(navXAxis);
//
//   // add the data in the bottom part
//
//   navData = d3.svg.area()
//   .x(function (d) { return navXScale(d.date); })
//   .y0(navHeight)
//   .y1(function (d) { return navYScale(d.val); })
//   .interpolate('basis');
//
//   navChart.append('path')
//   .attr('class', 'data')
//   .attr('d', navData(accumData));
//
//   //brush event ??
//
//   viewport = d3.svg.brush()
//   .x(navXScale)
//   .on("brush", function () {
//       xScale.domain(viewport.empty() ? navXScale.domain() : viewport.extent());
//       redrawChart(plotArea,plotChart,xScale,yScale,accumData,xAxis,height);
//   });
//
//   //viewport component
//
//   navChart.append("g")
//   .attr("class", "viewport")
//   .call(viewport)
//   .selectAll("rect")
//   .attr("height", navHeight);
//
//
// //zoom and stuff
//   zoom = d3.behavior.zoom()
//     .x(xScale)
//     .on('zoom', function() {
//         if (xScale.domain()[0] < minDate) {
// 	    var x = zoom.translate()[0] - xScale(minDate) + xScale.range()[0];
//             zoom.translate([x, 0]);
//         } else if (xScale.domain()[1] > maxDate) {
// 	    var x = zoom.translate()[0] - xScale(maxDate) + xScale.range()[1];
//             zoom.translate([x, 0]);
//         }
//         redrawChart(plotArea,plotChart,xScale,yScale,accumData,xAxis,height);
//         updateViewportFromChart(minDate,maxDate,xScale,viewport,navChart);
//     });
//
//     var overlay = d3.svg.area()
//         .x(function (d) { return xScale(d.date); })
//         .y0(0)
//         .y1(height);
//
//     plotArea.append('path')
//         .attr('class', 'overlay')
//         .attr('d', overlay(accumData))
//         .call(zoom);
//
//     viewport.on("brushend", function () {
//         updateZoomFromChart(zoom,xScale,maxDate,minDate);
//     });
//
//   xScale.domain([
//       accumData[accumData.length-2].date,
//       accumData[accumData.length-1].date
//   ]);
//
//
//
//   redrawChart(plotArea,plotChart,xScale,yScale,accumData,xAxis,height);
//   updateViewportFromChart(minDate,maxDate,xScale,viewport,navChart);
//   updateZoomFromChart(zoom,xScale,maxDate,minDate);
//
// }
//
// function updateZoomFromChart(zoom,xScale,maxDate,minDate) {
//
//     zoom.x(xScale);
//
//     var fullDomain = maxDate - minDate,
//         currentDomain = selectedTimeRange[1] - selectedTimeRange[0];
//
//     var minScale = currentDomain / fullDomain,
//         maxScale = minScale * 20;
//
//     zoom.scaleExtent([minScale, maxScale]);
// }
//
// function updateViewportFromChart(minDate,maxDate,xScale,viewport,navChart) {
//   if ((selectedTimeRange[0] <= minDate) && (selectedTimeRange[1] >= maxDate)) {
//     console.log('crossing')
//       viewport.clear();
//   }
//   else {
//       viewport.extent(xScale.domain());
//   }
//   navChart.select('.viewport').call(viewport);
// }
//
// function redrawChart(plotArea,plotChart,xScaleTemp,yScale,accumData,xAxis,height) {
//
//   var lineFuncTemp = d3.svg.line()
//   .x(function(d) {
//     return xScale(new Date(d.date));
//   })
//   .y(function(d) {
//     return yScale(d.val);
//   })
//   .interpolate('basis');
//
//   $('.line-graph-area').remove();
//
//   plotArea.append('svg:path')
//   .attr('d', lineFuncTemp(accumData))
//   .attr('class','line-graph-area')
//   .attr('fill','none');
//
//
//   plotChart.select('.line-graph-axis').call(xAxis);
//   selectedTimeRange = xScaleTemp.domain();
//   plotChart.select('.line-graph-axis-y').call(yAxis);
//
//   getEnergyUsage();
//
// }
//
// function redrawNavigator() {
//
//   var minN = d3.min(accumData, function (d) { return d.date; }).getTime(),
//       maxN = d3.max(accumData, function (d) { return d.date; }).getTime();
//   var minDate = new Date(minN),
//       maxDate = new Date(maxN);
//
//   navXScale = d3.time.scale()
//   .domain([minDate, maxDate])
//   .range([0, navWidth]);
//
//   var navDataTemp = d3.svg.area()
//   .x(function (d) { return navXScale(d.date); })
//   .y0(navHeight)
//   .y1(function (d) { return navYScale(d.val); })
//   .interpolate('basis');
//
//   $('.data').remove();
//   $('.viewport').remove();
//
//   navChart.append('path')
//   .attr('class', 'data')
//   .attr('d', navDataTemp(accumData));
//
//   //brush event ??
//
//   viewport = d3.svg.brush()
//   .x(navXScale)
//   .on("brush", function () {
//       xScale.domain(viewport.empty() ? navXScale.domain() : viewport.extent());
//       redrawChart(plotArea,plotChart,xScale,yScale,accumData,xAxis,height);
//   });
//
//   //viewport component
//
//   navChart.append("g")
//   .attr("class", "viewport")
//   .call(viewport)
//   .selectAll("rect")
//   .attr("height", navHeight);
//
//   xScale.domain([
//       selectedTimeRange[0],
//       selectedTimeRange[1]
//   ]);
//
//   redrawChart(plotArea,plotChart,xScale,yScale,accumData,xAxis,height);
//   updateViewportFromChart(minDate,maxDate,xScale,viewport,navChart)
//
// }

function addEveryMinute(equipId) {
  var oneMin = 120*1000;
  var serverUrl = "https://agile-reef-71741.herokuapp.com";//"https://itpenertivserver.herokuapp.com";
  //call the outlet every 1 minute to check if the number has changed
  setInterval(function(){
    console.log('getting line graph data per minute');
    var now = new Date();
    now.setSeconds(0);
    startTime1 = now - 120*1000; // - 5*60*60*1000;
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
        }
      })
  }, 6000);

}

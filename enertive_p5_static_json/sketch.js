/* This example loads two json files of the power usage from 
 shop and ITP floor, and makes line charts.

 made by Mathura M G

 http://alpha.editor.p5js.org/mathura/sketches/Sy86Na7-x
*/

var a;
function preload() {
  
}

function setup() { 
  createCanvas(screen.width, screen.height);
  background(0);
  a = loadJSON('Shop_From_Nov1.json', drawLineShop);
  b = loadJSON('ITP_From_Nov1.json', drawLineITP);
  fill(200);
  title = text('Nov 1 - Nov 11', 20, 20);
} 

function draw() { 
  // 
}

function drawLineShop(data) {
  print(data);
  print(data.data.length);
  stroke(212, 100, 63);
  for(i = 1; i < data.data.length; i++) {
    line((i - 1) * (width / data.data.length), 400 - data.data[i - 1]["Rm 409 (Shop)"] * 10 + 100,i * (width / data.data.length), 400 - data.data[i]["Rm 409 (Shop)"] * 10 + 100);
  }
}

function drawLineITP(data) {
  print(data);
  print(data.data.length);
  stroke(32, 124, 211);
  for(i = 1; i < data.data.length; i++) {
    line((i - 1 ) * (width / data.data.length),400 - data.data[i - 1]["NYU ITP"] * 10 + 100, i * (width / data.data.length), 400 - data.data[i]["NYU ITP"] * 10 + 100);
  }
}
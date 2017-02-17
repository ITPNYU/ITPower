var fr = .1;
var url;
var i;

function setup() {
	frameRate(fr);
	url = 'http://localhost:8080/data';
	createCanvas(800, 600);
	background('#ec5a13');
	textAlign(CENTER);
	i = 100;
}

function draw() {
  loadJSON(url, showData);
}

function showData(enertivData) {
	var device = enertivData.names[0];
	var time = enertivData.data[0].x;
	var usage = enertivData.data[0][device];

	console.log('device: ' + device);
	console.log('time: ' + time);
	console.log('usage: ' + usage);

	var estime = new Date(time);
	var min = estime.toString().split(':')[1];

	var size = map(usage, 0, 4, 0, 240);

	if (i === 100) {
		fill(255);
		strokeWeight(0.3);
		textSize(20);
		text(device, width / 2, height / 2 - 170);

		var startTime = 'Start From ' + estime.toString().split(':')[0] + ':' + estime.toString().split(':')[1];
		textSize(16);
	  text(startTime, width / 2, height / 2 - 120);

	  fill('#f2ffc0');
	  stroke('#f2ffc0');
	  for (var j = 0; j < 240; j += 40) {
	  	line(i, height / 2 + 150 - j, width - 140, height / 2 + 150 - j);
	  }
	}

	strokeWeight(4);
	line(i, height / 2 + 150, i, height / 2 + 150 - size);
	ellipse(i, height / 2 + 150 - size, 3, 3);

	strokeWeight(0);
	text(usage, i, height / 2 + 150 - size - 20);
	text(min, i, height / 2 + 170);

	i += 50;
}

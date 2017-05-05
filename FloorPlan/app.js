function toggle(id) {
  console.log(id);
  image = document.getElementById(id);
  if(image.style.opacity == 0.8) {
    image.style.opacity = 0;
    console.log("a");
  }
  else {
    image.style.opacity = 0.8;
    console.log("b");
  }
}

window.onload = function() {
  layers = document.getElementsByClassName('layer-image');
  for(var i=0;i<layers.length;i++) {
    console.log("start");
    layers[i].style.opacity = 0;
  }
}

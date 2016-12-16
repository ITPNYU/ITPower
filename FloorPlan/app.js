function toggle(id) {
  image = document.getElementById(id);
  if(image.style.opacity == 0.8) {
    image.style.opacity = 0;
  }
  else {
    image.style.opacity = 0.8;
  }
}

window.onload = function() {
  layers = document.getElementsByClassName('layer-image');
  for(var i=0;i<layers.length;i++) {
    layers[i].style.opacity = 0;
  }
}

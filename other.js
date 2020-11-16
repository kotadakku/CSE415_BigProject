var r_light_color = document.getElementById("r_light_color");
var g_light_color = document.getElementById("g_light_color");
var b_light_color = document.getElementById("b_light_color");
var r_light_color_text = document.getElementById("r_light_color_text");
var g_light_color_text = document.getElementById("g_light_color_text");
var b_light_color_text = document.getElementById("b_light_color_text");
r_light_color_text.innerHTML = r_light_color.value;
g_light_color_text.innerHTML = g_light_color.value;
b_light_color_text.innerHTML = b_light_color.value;

var r_background_color = document.getElementById("r_background_color");
var g_background_color = document.getElementById("g_background_color");
var b_background_color = document.getElementById("b_background_color");
var r_background_color_text = document.getElementById("r_background_color_text");
var g_background_color_text = document.getElementById("g_background_color_text");
var b_background_color_text = document.getElementById("b_background_color_text");
r_background_color_text.innerHTML = r_background_color.value;
g_background_color_text.innerHTML = g_background_color.value;
b_background_color_text.innerHTML = b_background_color.value;

var r_object_color = document.getElementById("r_object_color");
var g_object_color = document.getElementById("g_object_color");
var b_object_color = document.getElementById("b_object_color");
var r_object_color_text = document.getElementById("r_object_color_text");
var g_object_color_text = document.getElementById("g_object_color_text");
var b_object_color_text = document.getElementById("b_object_color_text");
r_object_color_text.innerHTML = r_object_color.value;
g_object_color_text.innerHTML = g_object_color.value;
b_object_color_text.innerHTML = b_object_color.value;


function changeLightColor(){
    r_light_color_text.innerHTML = r_light_color.value;
    g_light_color_text.innerHTML = g_light_color.value;
    b_light_color_text.innerHTML = b_light_color.value;
  }

  function changeBackgroundColor(){
    r_background_color_text.innerHTML = r_background_color.value;
    g_background_color_text.innerHTML = g_background_color.value;
    b_background_color_text.innerHTML = b_background_color.value;
  }

  function changeObjectColor(){
    r_object_color_text.innerHTML = r_object_color.value;
    g_object_color_text.innerHTML = g_object_color.value;
    b_object_color_text.innerHTML = b_object_color.value;
  }

  r_light_color.oninput = function(){
    changeLightColor()
  }
  g_light_color.oninput = function(){
    changeLightColor()
  }
  b_light_color.oninput = function(){
    changeLightColor()
  }
  r_background_color.oninput = function(){
    changeBackgroundColor()
  }
  g_background_color.oninput = function(){
    changeBackgroundColor()
  }
  b_background_color.oninput = function(){
    changeBackgroundColor()
  }
  r_object_color.oninput = function(){
    changeObjectColor()
  }
  g_object_color.oninput = function(){
    changeObjectColor()
  }
  b_object_color.oninput = function(){
    changeObjectColor()
  }
// PointLightedCube_perFragment.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
  'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
     // Calculate the vertex position in the world coordinate
  '  v_Position = vec3(u_ModelMatrix * a_Position);\n' +
  '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  v_Color = a_Color;\n' + 
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform vec3 u_LightColor;\n' +     // Light color
  'uniform vec3 u_LightPosition;\n' +  // Position of the light source
  'uniform vec3 u_AmbientLight;\n' +   // Ambient light color
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
     // Normalize the normal because it is interpolated and not 1.0 in length any more
  '  vec3 normal = normalize(v_Normal);\n' +
     // Calculate the light direction and make its length 1.
  '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
     // The dot product of the light direction and the orientation of a surface (the normal)
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
     // Calculate the final color from diffuse reflection and ambient reflection
  '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +
  '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +
  '  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
  '}\n';

var g_eyeX = 6, g_eyeY = 6, g_eyeZ = 20;
 r_object_color = 1.0
  g_object_color = 1.0
  b_object_color = 1.0
function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // 
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }


  // Set the clear color and enable the depth test
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage locations of uniform variables
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
  var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  if (!u_ModelMatrix || !u_MvpMatrix || !u_NormalMatrix || !u_LightColor || !u_LightPosition　|| !u_AmbientLight) { 
    console.log('Failed to get the storage location');
    return;
  }
  r_light_color = (myform.r_light_color.value/255)
  g_light_color = (myform.g_light_color.value/255)
  b_light_color = (myform.b_light_color.value/255)

 

  document.getElementById("bt").onclick = function(){
    r_light_color = (myform.r_light_color.value/255)
    g_light_color = (myform.g_light_color.value/255)
    b_light_color = (myform.b_light_color.value/255)

    r_background_color = (myform.r_background_color.value/255)
    g_background_color = (myform.g_background_color.value/255)
    b_background_color = (myform.b_background_color.value/255)

    r_object_color = (myform.r_object_color.value/255)
    g_object_color = (myform.g_object_color.value/255)
    b_object_color = (myform.b_object_color.value/255)

    initVertexBuffers(gl);

    gl.clearColor(r_background_color, g_background_color, b_background_color, 1.0);
    gl.uniform3f(u_LightColor, r_light_color, g_light_color, b_light_color);
    tick()
}
  
  // Set the light color (white)
  gl.uniform3f(u_LightColor, r_light_color, g_light_color, b_light_color);
  // Set the light direction (in the world coordinate)
  gl.uniform3f(u_LightPosition, 2.3, 4.0, 3.5);
  // Set the ambient light
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  var modelMatrix = new Matrix4();  // Model matrix
  var mvpMatrix = new Matrix4();    // Model view projection matrix
  var normalMatrix = new Matrix4(); // Transformation matrix for normals
  var currentAngle = 0.0;
  var stop=false;
  document.onkeydown = function(ev){ keydown(ev); };
  function keydown(ev) {
    // alert(ev.keyCode)
    if(ev.keyCode == 83) { // The right arrow key was pressed
      if(stop == false) stop = true;
      else stop = false;
      tick();
    } else
    if(ev.keyCode == 38) { // The right arrow key was pressed
      g_eyeZ -= 1;
    } else 
    if (ev.keyCode == 40) { // The left arrow key was pressed
      g_eyeZ += 1;
    }
    if(ev.keyCode == 37) { // The right arrow key was pressed
      g_eyeY += 1;
    } else 
    if (ev.keyCode == 39) { // The left arrow key was pressed
      g_eyeY -= 1;
    }
     else { return; }
    
    tick();    
}
  
  // Start drawing
  var tick = function() {
    currentAngle = animate(currentAngle);  // Update the rotation angle
    
    modelMatrix = setModelMatrix(modelMatrix, currentAngle)
    // Calculate the model matrix
    modelMatrix.setRotate(currentAngle, 0, 1, 0); // Rotate around the y-axis
    // Calculate the view projection matrix
    // viewMatrix.setLookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
    mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    mvpMatrix.lookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
    mvpMatrix.multiply(modelMatrix);
    // Calculate the matrix to transform the normal based on the model matrix
    normalMatrix = setNormalMatrix(normalMatrix, modelMatrix)
    
    // Pass the model matrix to u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Pass the model view projection matrix to u_mvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

      // Pass the transformation matrix for normals to u_NormalMatrix
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw the cube
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    if(stop==false){
      requestAnimationFrame(tick, canvas); // Request that the browser calls tick
    }
    
  };
  tick();
  onf = document.getElementById("kiemtra")

  
  onf.onchange = function(){
    if(onf.checked==true){  
      gl.uniform3f(u_LightColor, 0.0, 0.0, 0.0);
      tick();
    }
    if(onf.checked==false){
      gl.uniform3f(u_LightColor, r_light_color, g_light_color, b_light_color);
      tick();
    }
  }
  st = document.getElementById("stop")
  st.onchange = function(){
    if(st.checked==true){  
      stop = true;
      tick();
    }
    if(st.checked==false){
     stop = false;
      tick();
    }
  }

}

function initVertexBuffers(gl) {
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  // Coordinates
  var vertices = new Float32Array([
     2.0, 2.0, 2.0,  -2.0, 2.0, 2.0,  -2.0,-2.0, 2.0,   2.0,-2.0, 2.0, // v0-v1-v2-v3 front
     2.0, 2.0, 2.0,   2.0,-2.0, 2.0,   2.0,-2.0,-2.0,   2.0, 2.0,-2.0, // v0-v3-v4-v5 right
     2.0, 2.0, 2.0,   2.0, 2.0,-2.0,  -2.0, 2.0,-2.0,  -2.0, 2.0, 2.0, // v0-v5-v6-v1 up
    -2.0, 2.0, 2.0,  -2.0, 2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0,-2.0, 2.0, // v1-v6-v7-v2 left
    -2.0,-2.0,-2.0,   2.0,-2.0,-2.0,   2.0,-2.0, 2.0,  -2.0,-2.0, 2.0, // v7-v4-v3-v2 down
     2.0,-2.0,-2.0,  -2.0,-2.0,-2.0,  -2.0, 2.0,-2.0,   2.0, 2.0,-2.0  // v4-v7-v6-v5 back
  ]);

  // Colors
 //  var colors = new Float32Array([
 //    1, 1, 1,  1, 1, 1,   1, 1, 1,  1, 1, 1,     // v0-v1-v2-v3 front
 //    1, 1, 1,  1, 1, 1,   1, 1, 1,  1, 1, 1,     // v0-v3-v4-v5 right
 //    1, 1, 1,  1, 1, 1,   1, 1, 1,  1, 1, 1,     // v0-v5-v6-v1 up
 //    1, 1, 1,  1, 1, 1,   1, 1, 1,  1, 1, 1,     // v1-v6-v7-v2 left
 //    1, 1, 1,  1, 1, 1,   1, 1, 1,  1, 1, 1,     // v7-v4-v3-v2 down
 //    1, 1, 1,  1, 1, 1,   1, 1, 1,  1, 1, 1,　    // v4-v7-v6-v5 back
 // ]);
   var colors = new Float32Array([
    r_object_color, g_object_color, b_object_color,  r_object_color, g_object_color, b_object_color,     // v0-v1-v2-v3 front
    r_object_color, g_object_color, b_object_color,  r_object_color, g_object_color, b_object_color,     // v0-v3-v4-v5 right
    r_object_color, g_object_color, b_object_color,  r_object_color, g_object_color, b_object_color,     // v0-v5-v6-v1 up
    r_object_color, g_object_color, b_object_color,  r_object_color, g_object_color, b_object_color,     // v1-v6-v7-v2 left
    r_object_color, g_object_color, b_object_color,  r_object_color, g_object_color, b_object_color,     // v7-v4-v3-v2 down
    r_object_color, g_object_color, b_object_color,  r_object_color, g_object_color, b_object_color,　    // v4-v7-v6-v5 back
 ]);

  // Normal
  var normals = new Float32Array([
    0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
    1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
    0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
   -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
    0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
    0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
  ]);

  // Indices of the vertices
  var indices = new Uint8Array([
     0, 1, 2,   0, 2, 3,    // front
     4, 5, 6,   4, 6, 7,    // right
     8, 9,10,   8,10,11,    // up
    12,13,14,  12,14,15,    // left
    16,17,18,  16,18,19,    // down
    20,21,22,  20,22,23     // back
 ]);

  // Write the vertex property to buffers (coordinates, colors and normals)
  if (!initArrayBuffer(gl, 'a_Position', vertices, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Color', colors, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, 3)) return -1;

  // Unbind the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Write the indices to the buffer object
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return indices.length;
}

function initArrayBuffer(gl, attribute, data, num) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, gl.FLOAT, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}

function setModelMatrix(modelMatrix, currentAngle){
  modelMatrix.setRotate(currentAngle, 0, 1, 0);
  return modelMatrix
}
function setNormalMatrix(normalMatrix, modelMatrix){
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    return normalMatrix
}

var ANGLE_STEP = 30.0;
// Last time that this function was called
var g_last = Date.now();
function animate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}

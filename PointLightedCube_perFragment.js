// PointLightedCube_perFragment.js (c) 2012 matsuda
//Chương trình Vertex shader 
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +     //Pháp tuyến
  'uniform mat4 u_MvpMatrix;\n' +    
  'uniform mat4 u_ModelMatrix;\n' +    // Model matrix
  'uniform mat4 u_NormalMatrix;\n' +   // Transformation matrix of the normal
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
     // Tính vị trí đỉnh theo tọa độ thực
  '  v_Position = vec3(u_ModelMatrix * a_Position);\n' +
  '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  v_Color = a_Color;\n' + 
  '}\n';

// Chương trình Fragment shader
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform vec3 u_LightColor;\n' +     // Màu ánh sáng
  'uniform vec3 u_LightPosition;\n' +  // Tọa độ thực, chuẩn hóa
  'uniform vec3 u_AmbientLight;\n' +   // Màu ánh sáng Ambient
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
     // Chuẩn hóa pháp tuyến vì nó được nội suy và khác 1.0
  '  vec3 normal = normalize(v_Normal);\n' +
     // Chuẩn hóa ánh sáng và biến đổi nó có độ dài là 1.0
  '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
     // Tích vô hướng của ánh sáng và pháp tuyến cosθ = 〈light direction 〉×〈orientation of a surface 〉
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
     // Tính màu cuối từ phản xạ khuếch tán và xung quanh
  '  vec3 diffuse = u_LightColor * v_Color.rgb * nDotL;\n' +  //Tính màu cuối từ phản xạ khuếch tán 〈surface color by diffuse reflection 〉=〈 light color〉 × 〈 base color of surface〉 ×cosθ 
  '  vec3 ambient = u_AmbientLight * v_Color.rgb;\n' +    //Tính màu cuối từ phản xạ xung quanh
  '  gl_FragColor = vec4(diffuse + ambient, v_Color.a);\n' +
  '}\n';


var currentAngle = 0.0;   //Góc quay hiện tại
var stop=false;   //Dừng hay quay
// Trục quay (0,0,0)->(x_spin, y_spin, z_spin)
var x_spin=0.0;
var y_spin=0.0;
var z_spin=1.0;

function main() {
  // Lấy phần tử <canvas>
  var canvas = document.getElementById('webgl');

  // Lấy ngữ cảnh dựng cho cho WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Khởi tạo các shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Khởi tạo bộ đệm đối tượng
  var n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }
  // Lấy phần tử từ HTML
  
  var st = document.getElementById("stop");   // Lấy checkbox dừng/quay
  var onf = document.getElementById("onf")    // Lấy checkbox tắt/bật
  var v_spin = document.getElementById("v_spin")    // Lấy input tốc độ quay
  // Lấy input vị trí nhìn
  var x_lookat = document.getElementById("x_lookat");
  var y_lookat = document.getElementById("y_lookat");
  var z_lookat = document.getElementById("z_lookat");
  // Lấy input tọa độ trục quay
  var x_sp = document.getElementById("x_spin")
  var y_sp = document.getElementById("y_spin")
  var z_sp = document.getElementById("z_spin")
  //Gán input vị trí ban đầu 
  x_light_location = document.getElementById("x_light_location")
  y_light_location = document.getElementById("y_light_location")
  z_light_location = document.getElementById("z_light_location")
  // Lấy input- màu ánh sáng
  var r_light_color = document.getElementById("r_light_color")
  var g_light_color = document.getElementById("g_light_color")
  var b_light_color = document.getElementById("b_light_color")
  var r_light_color_text = document.getElementById("r_light_color_text")
  var g_light_color_text = document.getElementById("g_light_color_text")
  var b_light_color_text = document.getElementById("b_light_color_text")
  r_light_color_text.innerHTML = r_light_color.value
  g_light_color_text.innerHTML = g_light_color.value
  b_light_color_text.innerHTML = b_light_color.value
  // Lấy input màu nền
  var r_background_color = document.getElementById("r_background_color");
  var g_background_color = document.getElementById("g_background_color");
  var b_background_color = document.getElementById("b_background_color");
  var r_background_color_text = document.getElementById("r_background_color_text");
  var g_background_color_text = document.getElementById("g_background_color_text");
  var b_background_color_text = document.getElementById("b_background_color_text");
  r_background_color_text.innerHTML = r_background_color.value
  g_background_color_text.innerHTML = g_background_color.value
  b_background_color_text.innerHTML = b_background_color.value
  // Lấy input màu hình lập phương
  var r_object_color = document.getElementById("r_object_color");
  var g_object_color = document.getElementById("g_object_color");
  var b_object_color = document.getElementById("b_object_color");
  var r_object_color_text = document.getElementById("r_object_color_text");
  var g_object_color_text = document.getElementById("g_object_color_text");
  var b_object_color_text = document.getElementById("b_object_color_text");
  r_object_color_text.innerHTML = r_object_color.value
  g_object_color_text.innerHTML = g_object_color.value
  b_object_color_text.innerHTML = b_object_color.value
  //Lấy input màu phản chiếu
  r_ambient_color = document.getElementById("r_ambient_color");
  g_ambient_color = document.getElementById("g_ambient_color");
  b_ambient_color = document.getElementById("b_ambient_color");
  r_ambient_color_text = document.getElementById("r_ambient_color_text");
  g_ambient_color_text = document.getElementById("g_ambient_color_text");
  b_ambient_color_text = document.getElementById("b_ambient_color_text");
  r_ambient_color_text.innerHTML = r_ambient_color.value
  g_ambient_color_text.innerHTML = g_ambient_color.value
  b_ambient_color_text.innerHTML = b_ambient_color.value

  //Gán màu ban đầu cho tọa độ trục quay OA -> A(x_spin,y_spin, z_spin)
  x_spin = x_sp.value
  y_spin = y_sp.value
  z_spin = z_sp.value
  // Gán giá trị ban đầu cho màu ánh sáng, chuyển từ (0,255)->(0,1)
  var r_lcolor=r_light_color.value/255;
  var g_lcolor=g_light_color.value/255; 
  var b_lcolor=b_light_color.value/255;
  // Gán giá trị ban đầu cho màu nền, chuyển từ (0,255)->(0,1)
  var r_bcolor=r_background_color.value/255;
  var g_bcolor=g_background_color.value/255;
  var b_bcolor=b_background_color.value/255;
  // Gán giá trị ban đầu cho màu phản chiếu, chuyển từ (0,255)->(0,1)
  var r_acolor=r_ambient_color.value/255;
  var g_acolor=g_ambient_color.value/255;
  var b_acolor=b_ambient_color.value/255;
  // Gán giá trị ban đầu cho vị trí nhìn từ A(g_eyeX, g_eyeY, g_eyeZ)->O
  var g_eyeX = x_lookat.value;
  var g_eyeY = y_lookat.value; 
  var g_eyeZ = z_lookat.value;
  // Góc quay (tốc độ quay)
  ANGLE_STEP=v_spin.value

  // Gán màu cho clearColor và kích hoạt hàm khủ mặt khuất
  gl.clearColor(r_bcolor, g_bcolor, b_bcolor, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Lấy vị trí lưu trữ của các biến đồng nhất
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
  

  var modelMatrix = new Matrix4();  // Model matrix
  var mvpMatrix = new Matrix4();    // Model view projection matrix
  var normalMatrix = new Matrix4(); // Transformation matrix for normals
  
  
  // Bắt đầu vẽ
  var tick = function() {
    // Thay đổi màu nền
    gl.clearColor(r_bcolor, g_bcolor, b_bcolor, 1.0);
    // Gán giá trị cho light color
    gl.uniform3f(u_LightColor, r_lcolor, g_lcolor, b_lcolor);
    // Gán giá trị cho light direction
    gl.uniform3f(u_LightPosition, x_light_location.value, y_light_location.value, z_light_location.value);
    // Gián giá trị cho ánh sáng khuêch tán
    gl.uniform3f(u_AmbientLight, r_acolor, g_acolor, b_acolor);
    currentAngle = animate(currentAngle);  // Cập nhật lại goc quay
    
    // Tính model matrix
    if(stop==false){
      modelMatrix.setRotate(currentAngle, x_spin, y_spin, z_spin); // Quay quanh trục OA với A(x_spin,y_spin, z_spin)
    }
    // Tính view projection matrix
    mvpMatrix.setPerspective(30, canvas.width/canvas.height, 1, 100);
    mvpMatrix.lookAt(g_eyeX, g_eyeY, g_eyeZ, 0, 0, 0, 0, 1, 0);
    mvpMatrix.multiply(modelMatrix);
    // Tính m atraanj để biến đổi pháp tuyến theo ma trận mô hình
    normalMatrix.setInverseOf(modelMatrix);   //Tính nghịch đảo cảu ma trân mô hình
    normalMatrix.transpose();   //chuyển vị ma trận kết quả
    
    // Truyền model matrix vào u_ModelMatrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    // Truyền model view projection matrix vào u_mvpMatrix
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

      // Truyền the transformation matrix for normals vào u_NormalMatrix
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Vẽ lại hình lập phương
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
    if(stop==false){
      requestAnimationFrame(tick, canvas); // Yêu cầu trình duyệt gọi lại hàm tick;
    }
    
  };
  tick();
  
  // Xử lý sự kiện khi checkbox tăt/bật thay đổi
  onf.onchange = function(){
    if(onf.checked==true){  
      if(onf.checked==true){  
      r_lcolor=0.0;
      g_lcolor=0.0; 
      b_lcolor=0.0;   //ánh sáng màu đen
    }
      tick();   //vẽ lại
    }
    if(onf.checked==false){
      r_lcolor=r_light_color.value/255;   //cập nhật lại màu ánh sáng
      g_lcolor=g_light_color.value/255; 
      b_lcolor=b_light_color.value/255;
      tick();   //vẽ lại
    }
  }

  // Xử lý sự kiện khi checkbox dừng/quay thay đổi
  st.onchange = function(){
    if(st.checked==true){  
      stop = true;
      tick();   //vẽ lại
    }
    if(st.checked==false){
     stop = false;
      tick();   //vẽ lại
    }
  }
  // Xử lý sự kiện khi vị trí ánh sáng thay đổi
  x_light_location.onchange = function(){
    gl.uniform3f(u_LightPosition, x_light_location.value, y_light_location.value, z_light_location.value);  //cập nhật lại vị trí ánh sáng
    tick()    //vẽ lại
  }
  y_light_location.onchange = function(){
    gl.uniform3f(u_LightPosition, x_light_location.value, y_light_location.value, z_light_location.value);
    tick()
  }
  x_light_location.onchange = function(){
    gl.uniform3f(u_LightPosition, x_light_location.value, y_light_location.value, z_light_location.value);
    tick()
  }
   // Xử lý sự kiện khi vị trí nhìn thay đổi
  x_lookat.onchange = function(){
    g_eyeX=x_lookat.value   //cập nhật lại vị trí nhìn
    tick();   //vẽ lại
  }
  y_lookat.onchange = function(){
    g_eyeY=y_lookat.value
    tick();
  }
  z_lookat.onchange = function(){
    g_eyeZ=z_lookat.value
    tick();
  }
  // Xử lý sự kiện khi trục quay thay đổi
  x_sp.onchange = function(){
    x_spin = x_sp.value; //cập nhật lại trục quay
    tick();   //vẽ lại
  }

  y_sp.onchange = function(){
    y_spin = y_sp.value;
    tick();
  }
  z_sp.onchange = function(){
    z_spin = z_sp.value;
    tick();
  }
  // Xử lý sự kiện khi màu ánh sáng thay đổi
  function changeLightColor(){
    r_light_color_text.innerHTML = r_light_color.value
    g_light_color_text.innerHTML = g_light_color.value
    b_light_color_text.innerHTML = b_light_color.value
    r_lcolor=r_light_color.value/255;
    g_lcolor=g_light_color.value/255; 
    b_lcolor=b_light_color.value/255;

    if(onf.checked==true){  
      r_lcolor=0.0;
      g_lcolor=0.0; 
      b_lcolor=0.0;
    }
    tick();
  }
  // Xử lý sự kiện khi màu nền thay đổi
  function changeBackgroundColor(){

    r_background_color_text.innerHTML = r_background_color.value
    g_background_color_text.innerHTML = g_background_color.value
    b_background_color_text.innerHTML = b_background_color.value

    r_bcolor=r_background_color.value/255;
    g_bcolor=g_background_color.value/255;
    b_bcolor=b_background_color.value/255;
  
    tick();
  }
  // Xử lý sự kiện khi màu hình lập phương thay đổi
  function changeObjectColor(){
    r_object_color_text.innerHTML = r_object_color.value
    g_object_color_text.innerHTML = g_object_color.value
    b_object_color_text.innerHTML = b_object_color.value
    initVertexBuffers(gl);
  }
  // Xử lý sự kiện khi màu khuêch tán thay đổi
  function changeAmbientColor(){
    r_ambient_color_text.innerHTML = r_ambient_color.value
    g_ambient_color_text.innerHTML = g_ambient_color.value
    b_ambient_color_text.innerHTML = b_ambient_color.value
    r_acolor=r_ambient_color.value/255;
    g_acolor=g_ambient_color.value/255;
    b_acolor=b_ambient_color.value/255;
    tick();
  }
  // Xử lý sự kiện khi màu ánh sáng thay đổi
  r_light_color.oninput = function(){
    changeLightColor()
  }
  g_light_color.oninput = function(){
    changeLightColor()
  }
  b_light_color.oninput = function(){
    changeLightColor()
  }
  // Xử lý sự kiện khi màu nền thay đổi
  r_background_color.oninput = function(){
    changeBackgroundColor()
  }
  g_background_color.oninput = function(){
    changeBackgroundColor()
  }
  b_background_color.oninput = function(){
    changeBackgroundColor()
  }
   // Xử lý sự kiện khi màu hình lập phương thay đổi
  r_object_color.oninput = function(){
    changeObjectColor()
  }
  g_object_color.oninput = function(){
    changeObjectColor()
  }
  b_object_color.oninput = function(){
    changeObjectColor()
  }
   // Xử lý sự kiện khi màu khuêch tán thay đổi
  r_ambient_color.oninput = function(){
    changeAmbientColor();
  }
  g_ambient_color.oninput = function(){
    changeAmbientColor();
  }
  b_ambient_color.oninput = function(){
    changeAmbientColor();
  }
   // Xử lý sự kiện khi tốc độ quay thay đổi
  v_spin.oninput = function(){
    ANGLE_STEP=v_spin.value
    tick();
  }
}
// Khởi tạo bộ đệm đối tượng
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
  // Ma trận màu của hình lập phuong
  var colors = new Float32Array(72)
  for(var i=0; i<72; i=i+3){
    colors[i]=r_object_color.value/255;
    colors[i+1]=g_object_color.value/255;
    colors[i+2]=b_object_color.value/255;
   }

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

  // Gán bộ đệm đối tượng với một target
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // 
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  //Ghi các chỉ số vào bộ đệm đối tượng
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

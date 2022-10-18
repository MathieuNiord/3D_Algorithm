
// =====================================================
var gl;

// =====================================================
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
var rotMatrix = mat4.create();
var distCENTER;
// =====================================================

var OBJ1 = null;
var isTherePlane = false;
var PLANE = null;
var CUBEMAPS = null;

// =====================================================
// OBJET 3D, lecture fichier obj
// =====================================================

class objmesh {

	// --------------------------------------------
	constructor(objFname) {
		this.objName = 'obj/' + objFname;
		this.shaderName = 'obj';
		this.loaded = -1;
		this.shader = null;
		this.mesh = null;
		
		loadObjFile(this);
		loadShaders(this);
	}

	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.nAttrib = gl.getAttribLocation(this.shader, "aVertexNormal");
		gl.enableVertexAttribArray(this.shader.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.normalBuffer);
		gl.vertexAttribPointer(this.shader.nAttrib, this.mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.rMatrixUniform = gl.getUniformLocation(this.shader, "uRMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
	}
	
	// --------------------------------------------
	setMatrixUniforms() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		gl.uniformMatrix4fv(this.shader.rMatrixUniform, false, rotMatrix);
		gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
	}
	
	// --------------------------------------------
	draw() {
		if(this.shader && this.loaded==4 && this.mesh != null) {
			this.setShadersParams();
			this.setMatrixUniforms();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
			gl.drawElements(gl.TRIANGLES, this.mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}
}



// =====================================================
// PLAN 3D, Support géométrique
// =====================================================

class plane {
	
	// --------------------------------------------
	constructor() {
		this.shaderName='plane';
		this.loaded=-1;
		this.shader=null;
		this.initAll();
	}
		
	// --------------------------------------------
	initAll() {
		var size=1.0;
		var vertices = [
			-size, -size, 0.1,
			 size, -size, 0.1,
			 size, size, 0.1,
			-size, size, 0.1
		];

		var texcoords = [
			0.0,0.0,
			0.0,1.0,
			1.0,1.0,
			1.0,0.0
		];

		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 3;
		this.vBuffer.numItems = 4;

		this.tBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
		this.tBuffer.itemSize = 2;
		this.tBuffer.numItems = 4;

		loadShaders(this);
	}
	
	
	// --------------------------------------------
	setShadersParams() {
		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.tAttrib = gl.getAttribLocation(this.shader, "aTexCoords");
		gl.enableVertexAttribArray(this.shader.tAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.tBuffer);
		gl.vertexAttribPointer(this.shader.tAttrib,this.tBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");

		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);

		gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
	}

	// --------------------------------------------
	draw() {
		if(this.shader && this.loaded==4) {		
			this.setShadersParams();
			
			gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vBuffer.numItems);
			gl.drawArrays(gl.LINE_LOOP, 0, this.vBuffer.numItems);
		}
	}

}

// =====================================================
// CUBE 3D, Figure géométrique
// =====================================================

class cube {

	constructor() {
		this.shaderName='cube_colorized';
		this.loaded=-1;
		this.shader=null;
		this.initAll();
	}

	initAll() {

		var size = 0.5;

		const vertices = [
			// Front face
			-size, -size,  size,
			 size, -size,  size,
			 size,  size,  size,
			-size,  size,  size,
			// Back face
			-size, -size, -size,
			-size,  size, -size,
			 size,  size, -size,
			 size, -size, -size,
			// Top face
			-size,  size, -size,
			-size,  size,  size,
			 size,  size,  size,
			 size,  size, -size,
			// Bottom face
			-size, -size, -size,
			 size, -size, -size,
			 size, -size,  size,
			-size, -size,  size,
			// Right face
			 size, -size, -size,
			 size,  size, -size,
			 size,  size,  size,
			 size, -size,  size,
			// Left face
			-size, -size, -size,
			-size, -size,  size,
			-size,  size,  size,
			-size,  size, -size
		];

		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 3;
		this.vBuffer.numItems = 24;

		// Colors
		const faceColors = [
			Colors.white,	// Front face: white
			Colors.red,		// Back face: red
			Colors.green,	// Top face: green
			Colors.blue,	// Bottom face: blue
			Colors.yellow,	// Right face: yellow
			Colors.purple	// Left face: purple
		];

		var colors = [];

		for (var j = 0; j < faceColors.length; ++j) {
		  const c = faceColors[j];
		  // Repeat each color four times for the four vertices of the face
		  colors = colors.concat(c, c, c, c);
		}
			
		this.cBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
		this.cBuffer.itemSize = 3;
		this.cBuffer.numItems = 24;

		const indices = [
			0, 1, 2,      0, 2, 3,    // Front face
			4, 5, 6,      4, 6, 7,    // Back face
			8, 9, 10,     8, 10, 11,  // Top face
			12, 13, 14,   12, 14, 15, // Bottom face
			16, 17, 18,   16, 18, 19, // Right face
			20, 21, 22,   20, 22, 23  // Left face
		];

		/* const indices = [
			2, 1, 0,      3, 2, 0,    // Front face
			6, 5, 4,      7, 6, 4,    // Back face
			10, 9, 8,     11, 10, 8,  // Top face
			14, 13, 12,   15, 14, 12, // Bottom face
			18, 17, 16,   19, 18, 16, // Right face
			22, 21, 20,   23, 22, 20  // Left face
		]; */

		this.iBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		this.iBuffer.itemSize = 1;
		this.iBuffer.numItems = 36;

		loadShaders(this);
	}

	setShadersParams() {

		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib,this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		this.shader.cAttrib = gl.getAttribLocation(this.shader, "aVertexColor");
		gl.enableVertexAttribArray(this.shader.cAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.cBuffer);
		gl.vertexAttribPointer(this.shader.cAttrib,this.cBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.mvMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
	}

	setMatrixUniforms() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		gl.uniformMatrix4fv(this.shader.mvMatrixUniform, false, mvMatrix);
		gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
	}

	draw() {
		if(this.shader && this.loaded==4) {		
			this.setShadersParams();
			this.setMatrixUniforms();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
			gl.drawElements(gl.TRIANGLES, this.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}

}

// =====================================================
// CUBEMAPS
// =====================================================
class cubemaps {

	constructor() {
		this.shaderName='cubemaps';
		this.loaded=-1;
		this.shader=null;
		this.initAll();
	}

	initAll() {

		var size = 0.5;

		const vertices = [
			// Front face
			-size, -size,  size,
			 size, -size,  size,
			 size,  size,  size,
			-size,  size,  size,
			// Back face
			-size, -size, -size,
			-size,  size, -size,
			 size,  size, -size,
			 size, -size, -size,
			// Top face
			-size,  size, -size,
			-size,  size,  size,
			 size,  size,  size,
			 size,  size, -size,
			// Bottom face
			-size, -size, -size,
			 size, -size, -size,
			 size, -size,  size,
			-size, -size,  size,
			// Right face
			 size, -size, -size,
			 size,  size, -size,
			 size,  size,  size,
			 size, -size,  size,
			// Left face
			-size, -size, -size,
			-size, -size,  size,
			-size,  size,  size,
			-size,  size, -size
		];

		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 3;
		this.vBuffer.numItems = 24;

		const normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			
			0, 0, -1,
			0, 0,-1,
			0, 0, -1,
			0, 0, -1,

			0, 1, 0,
			0, 1, 0,
			0, 1, 0,
			0, 1, 0,

			0, -1, 0,
			0, -1, 0,
			0, -1, 0,
			0, -1, 0,

			1, 0, 0,
			1, 0, 0,
			1, 0, 0,
			1, 0, 0,

			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
			-1, 0, 0,
		]

		this.nBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
		this.nBuffer.itemSize = 3;
		this.nBuffer.numItems = 24;

		/* const indices = [
			2, 1, 0,      3, 2, 0,    // Front face
			6, 5, 4,      7, 6, 4,    // Back face
			10, 9, 8,     11, 10, 8,  // Top face
			14, 13, 12,   15, 14, 12, // Bottom face
			18, 17, 16,   19, 18, 16, // Right face
			22, 21, 20,   23, 22, 20  // Left face
		]; */

		const indices = [
			0, 1, 2,      0, 2, 3,    // Front face
			4, 5, 6,      4, 6, 7,    // Back face
			8, 9, 10,     8, 10, 11,  // Top face
			12, 13, 14,   12, 14, 15, // Bottom face
			16, 17, 18,   16, 18, 19, // Right face
			20, 21, 22,   20, 22, 23  // Left face
		];

		this.iBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		this.iBuffer.itemSize = 1;
		this.iBuffer.numItems = 36;

		this.initTextures();
		loadShaders(this);
	}

	setShadersParams() {

		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib,this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.nAttrib = gl.getAttribLocation(this.shader, "aNormal");
		gl.enableVertexAttribArray(this.shader.nAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
		gl.vertexAttribPointer(this.shader.nAttrib,this.nBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.pMatrixUniform = gl.getUniformLocation(this.shader, "uPMatrix");
		this.shader.uMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrix");
	}

	initTextures() {

		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

		const faceInfos = [
			{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: './textures/cubemap_museum/neg-z.jpg' },
			{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: './textures/cubemap_museum/pos-z.jpg' },
			{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: './textures/cubemap_museum/neg-y.jpg' },
			{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: './textures/cubemap_museum/pos-y.jpg' },
			{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: './textures/cubemap_museum/neg-x.jpg' },
			{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: './textures/cubemap_museum/pos-x.jpg' },
		];

		faceInfos.forEach((faceInfo) => {

			const { target, url } = faceInfo;
			const level = 0;
			const internalFormat = gl.RGBA;
			const width = 512;
			const height = 512;
			const format = gl.RGBA;
			const type = gl.UNSIGNED_BYTE;

			gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

			const texImage = new Image();
			texImage.src = url;
			texImage.onload = function () {
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
				gl.texImage2D(target, level, internalFormat, format, type, texImage);
				gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
			}
		});

		gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	}

	setMatrixUniforms() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		gl.uniformMatrix4fv(this.shader.pMatrixUniform, false, pMatrix);
		gl.uniformMatrix4fv(this.shader.uMatrixUniform, false, mvMatrix);
	}

	draw() {
		if(this.shader && this.loaded==4) {		
			this.setShadersParams();
			this.setMatrixUniforms();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
			gl.drawElements(gl.TRIANGLES, this.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}

}

// =====================================================
// SKYBOX
// =====================================================
class skybox {

	constructor() {
		this.shaderName='skybox';
		this.loaded=-1;
		this.shader=null;
		this.initAll();
	}

	initAll() {

		const size = 1.0;

		const vertices = [
			-size, -size,
			-size, size,
			size, size,
			size, -size,
		];

		this.vBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
		this.vBuffer.itemSize = 2;
		this.vBuffer.numItems = 6;

		const indices = [ 0, 1, 2, 0, 2, 3 ];

		this.iBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
		this.iBuffer.itemSize = 1;
		this.iBuffer.numItems = 6;

		this.initTextures();
		loadShaders(this);
	}

	setShadersParams() {

		gl.useProgram(this.shader);

		this.shader.vAttrib = gl.getAttribLocation(this.shader, "aVertexPosition");
		gl.enableVertexAttribArray(this.shader.vAttrib);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vAttrib,this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);

		this.shader.uSamplerUniform = gl.getUniformLocation(this.shader, "uSampler");
		this.shader.uMVInversedMatrixUniform = gl.getUniformLocation(this.shader, "uMVMatrixInversed");
	}

	initTextures() {

		var texture = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

		const faceInfos = [
			{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: './textures/cubemap_museum/pos-x.jpg' },
			{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: './textures/cubemap_museum/neg-x.jpg' },
			{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: './textures/cubemap_museum/pos-y.jpg' },
			{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: './textures/cubemap_museum/neg-y.jpg' },
			{ target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: './textures/cubemap_museum/pos-z.jpg' },
			{ target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: './textures/cubemap_museum/neg-z.jpg' },
		];

		faceInfos.forEach((faceInfo) => {

			const { target, url } = faceInfo;
			const level = 0;
			const internalFormat = gl.RGBA;
			const width = 512;
			const height = 512;
			const format = gl.RGBA;
			const type = gl.UNSIGNED_BYTE;

			gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);

			const texImage = new Image();
			texImage.src = url;
			texImage.onload = function () {
				gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
				gl.texImage2D(target, level, internalFormat, format, type, texImage);
				gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
			}
		});

		gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	}

	setMatrixUniforms() {
		mat4.identity(mvMatrix);
		mat4.translate(mvMatrix, distCENTER);
		mat4.multiply(mvMatrix, rotMatrix);
		gl.uniform1i(this.shader.uSamplerUniform, 0);
		gl.uniformMatrix4fv(this.shader.uMVInversedMatrixUniform, false, mat4.inverse(mvMatrix));
	}

	draw() {
		if(this.shader && this.loaded==4) {		
			this.setShadersParams();
			//this.setMatrixUniforms();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
			gl.drawElements(gl.TRIANGLES, this.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
		}
	}
}


// =====================================================
// FONCTIONS GENERALES, INITIALISATIONS
// =====================================================

// =====================================================
function initGL(canvas)
{
	try {
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
		gl.viewport(0, 0, canvas.width, canvas.height);

		gl.clearColor(0.7, 0.7, 0.7, 1.0);
		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK); 
	} catch (e) {}
	if (!gl) {
		console.log("Could not initialise WebGL");
	}
}


// =====================================================
loadObjFile = function(OBJ3D)
{
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			var tmpMesh = new OBJ.Mesh(xhttp.responseText);
			OBJ.initMeshBuffers(gl,tmpMesh);
			OBJ3D.mesh=tmpMesh;
		}
	}

	xhttp.open("GET", OBJ3D.objName, true);
	xhttp.send();
}



// =====================================================
function loadShaders(Obj3D) {
	loadShaderText(Obj3D,'.vs');
	loadShaderText(Obj3D,'.fs');
}

// =====================================================
function loadShaderText(Obj3D,ext) {   // lecture asynchrone...
  var xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function() {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		if(ext=='.vs') { Obj3D.vsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(ext=='.fs') { Obj3D.fsTxt = xhttp.responseText; Obj3D.loaded ++; }
		if(Obj3D.loaded==2) {
			Obj3D.loaded ++;
			compileShaders(Obj3D);
			Obj3D.loaded ++;
		}
	}
  }
  
  Obj3D.loaded = 0;
  xhttp.open("GET", 'glsl/' + Obj3D.shaderName + ext, true);
  xhttp.send();
}

// =====================================================
function compileShaders(Obj3D)
{
	Obj3D.vshader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(Obj3D.vshader, Obj3D.vsTxt);
	gl.compileShader(Obj3D.vshader);
	if (!gl.getShaderParameter(Obj3D.vshader, gl.COMPILE_STATUS)) {
		console.log("Vertex Shader FAILED... "+Obj3D.shaderName+".vs");
		console.log(gl.getShaderInfoLog(Obj3D.vshader));
	}

	Obj3D.fshader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(Obj3D.fshader, Obj3D.fsTxt);
	gl.compileShader(Obj3D.fshader);
	if (!gl.getShaderParameter(Obj3D.fshader, gl.COMPILE_STATUS)) {
		console.log("Fragment Shader FAILED... "+Obj3D.shaderName+".fs");
		console.log(gl.getShaderInfoLog(Obj3D.fshader));
	}

	Obj3D.shader = gl.createProgram();
	gl.attachShader(Obj3D.shader, Obj3D.vshader);
	gl.attachShader(Obj3D.shader, Obj3D.fshader);
	gl.linkProgram(Obj3D.shader);
	if (!gl.getProgramParameter(Obj3D.shader, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
		console.log(gl.getShaderInfoLog(Obj3D.shader));
	}
}


// =====================================================
function webGLStart() {
	
	var canvas = document.getElementById("WebGL-test");

	canvas.onmousedown = handleMouseDown;
	document.onmouseup = handleMouseUp;
	document.onmousemove = handleMouseMove;
	canvas.onwheel = handleMouseWheel;

	initGL(canvas);

	mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
	mat4.identity(rotMatrix);
	mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
	mat4.rotate(rotMatrix, rotY, [0, 0, 1]);

	distCENTER = vec3.create([0,-0.2,-3]);
	
	PLANE = new plane();

	CUBE = new cube();
	SKYBOX = new skybox();
	
	tick();
}

// =====================================================
function drawScene() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	if (OBJ1) OBJ1.draw();
	if (isTherePlane) PLANE.draw();
	SKYBOX.draw();
}




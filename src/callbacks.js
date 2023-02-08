
// =====================================================
// Mouse management
// =====================================================
var mouseDown = false;
var lastMouseX, lastMouseY = null;
var rotY = 0;
var rotX = -1;

// =====================================================
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (/* function FrameRequestCallback */ callback,
									/* DOMElement Element */ element) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

// ==========================================
function tick() {
	requestAnimFrame(tick);
	drawScene();
}

// =====================================================
function degToRad(degrees) {
	return degrees * Math.PI / 180;
}


// =====================================================
function handleMouseWheel(event) {
	distCENTER[2] += event.deltaY / 2000.0;
}

// =====================================================
function handleMouseDown(event) {
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
}

// =====================================================
function handleMouseUp(event) { mouseDown = false; }

// =====================================================
/**
 * Move to the next object in the list when
 * the user right-clicks on the canvas
 * @param {MouseEvent} event
 */
function handleMouseContextDown(event) {

	event.preventDefault(); // Avoid the browser's context menu

	// Get the selected object from the select element in the HTML
	var objSelect = document.getElementById("models_select");
	var objIndex = objSelect.selectedIndex;

	// Retrieve the next object in the list, if the last object is selected, then select the first object (not null)
	var nextObject = (objIndex + 1) % objSelect.options.length;
	nextObject = nextObject === 0 ? 1 : nextObject;
	
	objSelect.options[nextObject].click();	// Emulate a click on the next object
	objSelect.selectedIndex = nextObject;	// Set the selected index to the next object
}

// =====================================================
function handleMouseMove(event) {

	if (!mouseDown) return;

	var newX = event.clientX;
	var newY = event.clientY;
	var deltaX = newX - lastMouseX;
	var deltaY = newY - lastMouseY;

	/* Update the camera position if the user is moving his cursor
	on the canvas and the left mouse button is held down */
	if (event.shiftKey) distCENTER[2] += deltaY / 100.0;
	else {

		rotY += degToRad(deltaX / 5);
		rotX += degToRad(deltaY / 5);

		mat4.identity(rotMatrix);
		mat4.rotate(rotMatrix, rotX, [1, 0, 0]);
		mat4.rotate(rotMatrix, rotY, [0, 0, 1]);
	}

	lastMouseX = newX
	lastMouseY = newY;
}

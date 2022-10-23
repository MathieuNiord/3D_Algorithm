attribute vec3 aVertexPosition;
attribute vec3 aVertexColor;
attribute vec3 aVertexNormal;
    
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uRMatrix;
uniform bool uIsMirroring;

varying vec4 vPosition;
varying vec3 vNormal;
varying vec3 vColor;
    
void main() {
    vNormal = vec3(uRMatrix * vec4(aVertexNormal, 1.0)) ;
    vPosition = uMVMatrix * vec4(aVertexPosition, 1.0);
    if (!uIsMirroring) vColor = aVertexColor;
    gl_Position = uPMatrix * vPosition;
}
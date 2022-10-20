attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
    
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uRMatrix;

varying vec4 vPosition;
varying vec3 vNormal;
    
void main() {
    vNormal = vec3(uRMatrix * vec4(aVertexNormal, 1.0)) ;
    vPosition = uMVMatrix * vec4(aVertexPosition.xyz, 1.0);
    gl_Position = uPMatrix * vPosition;
}
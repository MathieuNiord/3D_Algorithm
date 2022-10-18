attribute vec3 aVertexPosition;
attribute vec3 aNormal;
    
uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
    
varying vec3 vPosition;
varying vec3 vNormal;
    
void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition,1.0);
    vPosition = (uMVMatrix * vec4(aVertexPosition,1.0)).xyz;
    vNormal = mat3(uMVMatrix) * aNormal;
}
/* attribute vec3 aVertexPosition;
attribute vec2 aTexCoords;
    
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 texCoords;
    
void main() {
    texCoords = vec4(aTexCoords, 1.0);
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
} */

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
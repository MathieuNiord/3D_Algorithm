attribute vec3 aVertexPosition;
    
uniform mat4 uPMatrix;
uniform mat4 uMVMatrix;
    
varying vec3 vPosition;
    
void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition,1.0);
    vPosition = aVertexPosition.xzy;
}

attribute vec3 aVertexPosition;

varying vec4 vTextCoords;

uniform mat4 uMVMatrixInversed;

void main() {
  vTextCoords = uMVMatrixInversed * vec4(aVertexPosition,1.0);
  gl_Position = vec4(aVertexPosition,1.0);
  gl_Position.z = 1.0;
}
precision mediump float;

uniform samplerCube uSampler;

varying vec4 vTextCoords;

void main() {
  gl_FragColor = textureCube(uSampler, normalize(vTextCoords.xyz / vTextCoords.w));
}
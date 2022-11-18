precision mediump float;

varying vec3 vPosition;
	
uniform samplerCube uSampler;
	
void main() {
	gl_FragColor = textureCube(uSampler, vPosition);
}
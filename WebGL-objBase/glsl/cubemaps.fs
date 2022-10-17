/* precision mediump float;

varying vec2 texCoords;

uniform samplerCube uSampler;

void main(void) {
	gl_FragColor = textureCube(uSampler, vec2(texCoords.s, texCoords.t));
}
 */

precision mediump float;

varying vec3 vPosition;
varying vec3 vNormal;
	
uniform samplerCube uSampler;
uniform vec3 uWorldCameraPosition;
	
void main() {
	vec3 worldNormal = normalize(vNormal);
	vec3 eyeToSurfaceDir = normalize(vPosition - uWorldCameraPosition);
	vec3 direction = reflect(eyeToSurfaceDir,worldNormal);
	gl_FragColor = textureCube(uSampler, direction);
}
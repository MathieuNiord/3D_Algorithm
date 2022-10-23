precision mediump float;

varying vec4 pos3D;
varying vec3 N;

uniform samplerCube uSampler;
uniform mat4 uInversedRotationMatrix;
uniform bool uIsMirroring;
uniform vec3 uColor;

// ==============================================
void main(void)
{
	if (uIsMirroring) {
		vec3 normals = normalize(N);
        vec3 I = normalize(-pos3D.xyz);
        vec3 R = reflect(I,normals);
        vec3 direction = mat3(uInversedRotationMatrix) * R;
        gl_FragColor = textureCube(uSampler, -direction.xzy);
	}
	else {
		vec3 col = vec3(uColor.xyz) * dot(N,normalize(vec3(-pos3D))); // Lambert rendering, eye light source
		gl_FragColor = vec4(col,1.0);
	}
}

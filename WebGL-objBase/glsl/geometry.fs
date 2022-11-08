precision mediump float;

varying vec3 vColor;
varying vec4 vPosition;
varying vec3 vNormal;
    
uniform samplerCube uSampler;
uniform mat4 uRotationMatrix;
uniform bool uIsMirroring;
uniform bool uIsReflecting;
uniform float uFresnelIndice;
    
void main() {

    vec3 normals = normalize(vNormal);
	vec3 I = normalize(-vPosition.xyz);
	vec3 reflectDirection = mat3(uRotationMatrix) * reflect(-I,normals);
	vec3 transmissionDirection = mat3(uRotationMatrix) * refract(-I, normals, 1.0 / uFresnelIndice);

    if (uIsMirroring) {
        gl_FragColor = textureCube(uSampler, -reflectDirection.xzy);
    }

    else if (uIsReflecting) {
		float c = dot(I, normals);
        float g = sqrt((uFresnelIndice * uFresnelIndice) + (c * c) - 1.0);
        float left = 0.5 * (((g - c) * (g - c)) / ((g + c) * (g + c)));
        float right = 1.0 + (((c * (g + c) - 1.0) * (c * (g + c) - 1.0)) / ((c * (g - c) + 1.0) * (c * (g - c) + 1.0)));
		float reflection = left * right;
		float transmission = 1.0 - reflection;
		
		vec4 colorReflection = vec4(textureCube(uSampler, reflectDirection.xzy).xyz * reflection, 1.0);
		vec4 colorTransmission = vec4(textureCube(uSampler, transmissionDirection.xzy).xyz * transmission, 1.0);

		gl_FragColor = colorTransmission + colorReflection;
	}

    else {
        vec3 col = vColor * dot(vNormal,normalize(vec3(-vPosition))); // Lambert rendering, eye light source
        gl_FragColor = vec4(col,1.0);
    }
}

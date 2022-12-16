precision mediump float;

varying vec4 pos3D;
varying vec3 N;

uniform samplerCube uSampler;
uniform mat4 uRotationMatrix;
uniform bool uIsMirroring;
uniform bool uIsTransmitting;
uniform bool uIsCookTorrance;

uniform float uFresnelIndice;
uniform float uSigma;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform float uLightIntensity;

uniform vec3 uColor;

#define PI 3.1415926535897932384626433832795

float ddot(vec3 a, vec3 b) {
	return max(0.0, dot(a, b));
}

float fresnelFactor(vec3 o, vec3 n) {
	// Formula application (cf. lesson - slide 33)
	float c = ddot(o, n);
	float g = sqrt((uFresnelIndice * uFresnelIndice) + (c * c) - 1.0);

	// Left and right side of the formula
	float left = 0.5 * (((g - c) * (g - c)) / ((g + c) * (g + c)));
	float right = 1.0 + (((c * (g + c) - 1.0) * (c * (g + c) - 1.0)) / ((c * (g - c) + 1.0) * (c * (g - c) + 1.0)));

	return left * right; // Fresnel factor
}

float geometryTerm(vec3 o, vec3 i, vec3 n, vec3 m) {

	float cos_theta = ddot(m, n); // angle between m and n

	// Geometry term of mask-shadowing
	return min(1.0, min(2.0 * (cos_theta * ddot(n, o) / ddot(o, m)), 2.0 * (cos_theta * ddot(n, i) / ddot(i, m))));

}

float distributionTerm(vec3 n, vec3 m) {

	float cos_theta = ddot(m, n); // angle between m and n
	float tan_theta2 = (1.0 - cos_theta * cos_theta) / (cos_theta * cos_theta);

	float sigma2 = uSigma * uSigma; // sigma^2
	float cos_theta4 = cos_theta * cos_theta * cos_theta * cos_theta; // cos_theta^4

	// Distribution term of normal distribution
	return exp(-(tan_theta2) / (2.0 * sigma2)) / (PI * (sigma2) * (cos_theta4));
}

// ==============================================
void main(void) {

	vec3 o = normalize(-pos3D.xyz); 					// View vector
	vec3 i = normalize(uLightPosition - pos3D.xyz); 	// Incident vector
	vec3 n = normalize(N); 							// Normal vector of the surface

	// Mirror + Transmission
	if(uIsCookTorrance) {

		float F = fresnelFactor(o, n);
		// Normal for a facet
		vec3 m = normalize(i + o); // half vector

		// Geometry term of mask-shadowing
		float G = geometryTerm(o, i, n, m);

		// Distribution term of normal distribution
		float D = distributionTerm(n, m);

		vec3 fr = ((1.0 - F) * uColor / PI) + ((F * D * G) / (4.0 * ddot(i, n) * ddot(o, n)));
		vec3 Li = uLightColor * uLightIntensity;
		// Li * fr * cos_theta
		gl_FragColor = vec4(Li * fr * ddot(n, i), 1.0);

	} else if(uIsMirroring && uIsTransmitting) {
		vec3 reflectDirection = mat3(uRotationMatrix) * reflect(-o, n);
		vec3 transmissionDirection = mat3(uRotationMatrix) * refract(-o, n, 1.0 / uFresnelIndice);

		float F = fresnelFactor(o, n); // Fresnel factor

		float transmission = 1.0 - F;
		vec4 colorReflection = vec4(textureCube(uSampler, reflectDirection.xzy).xyz * F, 1.0);
		vec4 colorTransmission = vec4(textureCube(uSampler, transmissionDirection.xzy).xyz * transmission, 1.0);
		gl_FragColor = colorTransmission + colorReflection;

	}

	// Perfect mirror
	else if(uIsMirroring) {
		vec3 reflectDirection = mat3(uRotationMatrix) * reflect(-o, n);
		gl_FragColor = textureCube(uSampler, reflectDirection.xzy);
	}
	// Transmission
	else if(uIsTransmitting) {
		vec3 transmissionDirection = mat3(uRotationMatrix) * refract(-o, n, 1.0 / uFresnelIndice);
		gl_FragColor = textureCube(uSampler, transmissionDirection.xzy);
	} else {
		vec3 col = vec3(uColor.xyz) * ddot(N, normalize(vec3(-pos3D)));
		gl_FragColor = vec4(col, 1.0);
	}
}

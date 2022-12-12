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

float ddot(vec3 a, vec3 b) {
	return max(0.0,dot(a, b));
}

// ==============================================
void main(void) {

	vec3 o = normalize(-pos3D.xyz); 					// View vector
	vec3 i = normalize(uLightPosition - pos3D.xyz); 	// Incident vector
	vec3 n = normalize(N); 							// Normal vector of the surface

	vec3 reflectDirection = mat3(uRotationMatrix) * reflect(-o, n);
	vec3 transmissionDirection = mat3(uRotationMatrix) * refract(-o, n, 1.0 / uFresnelIndice);

	// Mirror + Transmission
	if(uIsMirroring && uIsTransmitting) {		

		// Formula application (cf. lesson - slide 33)
		float c = ddot(o, n);
		float g = sqrt((uFresnelIndice * uFresnelIndice) + (c * c) - 1.0);

		// Left and right side of the formula
		float left = 0.5 * (((g - c) * (g - c)) / ((g + c) * (g + c)));
		float right = 1.0 + (((c * (g + c) - 1.0) * (c * (g + c) - 1.0)) / ((c * (g - c) + 1.0) * (c * (g - c) + 1.0)));

		float F = left * right; // Fresnel factor

		if(uIsCookTorrance) {

			float PI = 3.1415926535897932384626433832795;

			// Normal for a facet
			vec3 m = normalize(i + o); // half vector

			float cos_theta = ddot(m, n); // angle between m and n
			float tan_theta2 = (1.0 - cos_theta * cos_theta) / (cos_theta * cos_theta);

			float sigma2 = uSigma * uSigma; // sigma^2
			float cos_theta4 = cos_theta * cos_theta * cos_theta * cos_theta; // cos_theta^4

			// Geometry term of mask-shadowing
			float G = min(1.0, min(2.0 * (cos_theta * ddot(n, o) / ddot(o, m)), 2.0 * (cos_theta * ddot(n, i) / ddot(i, m))));
			
			// Distribution term of normal distribution
			float D = exp(-(tan_theta2) / (2.0 * sigma2)) / (PI * (sigma2) * (cos_theta4));

			vec3 fr = ((1.0 - F) * uColor / PI) + ((F * D * G) / (4.0 * ddot(i, n) * ddot(o, n)));

			// Li * fr * cos_theta
			gl_FragColor = vec4(uLightColor * fr * ddot(n, i), 1.0);
		}
		
		else {
			float transmission = 1.0 - F;
			vec4 colorReflection = vec4(textureCube(uSampler, reflectDirection.xzy).xyz * F, 1.0);
			vec4 colorTransmission = vec4(textureCube(uSampler, transmissionDirection.xzy).xyz * transmission, 1.0);
			gl_FragColor = colorTransmission + colorReflection;
		}

	}

	// Perfect mirror
	else if(uIsMirroring)
		gl_FragColor = textureCube(uSampler, reflectDirection.xzy);

	// Transmission
	else if(uIsTransmitting)
		gl_FragColor = textureCube(uSampler, transmissionDirection.xzy);

	else {
		vec3 col = vec3(uColor.xyz) * ddot(N, normalize(vec3(-pos3D)));
		gl_FragColor = vec4(col, 1.0);
	}
}

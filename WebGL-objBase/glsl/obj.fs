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

uniform vec3 uColor;

// ==============================================
void main(void) {

	// The light is a directional light and is not affected by the rotation of the cube
	vec3 lightPosition = vec3(uRotationMatrix * vec4(uLightPosition, 0.0));

	vec3 o = normalize(-pos3D.xyz); 					// View vector
	vec3 i = normalize(lightPosition - pos3D.xyz); 	// Incident vector
	vec3 n = normalize(N); 							// Normal vector of the surface

	vec3 reflectDirection = mat3(uRotationMatrix) * reflect(-o, n);
	vec3 transmissionDirection = mat3(uRotationMatrix) * refract(-o, n, 1.0 / uFresnelIndice);

	// Mirror + Transmission
	if (uIsMirroring && uIsTransmitting) {		

		// Formula application (cf. lesson - slide 33)
		float c = dot(o, n);
		float g = sqrt((uFresnelIndice * uFresnelIndice) + (c * c) - 1.0);

		// Left and right side of the formula
		float left = 0.5 * (((g - c) * (g - c)) / ((g + c) * (g + c)));
		float right = 1.0 + (((c * (g + c) - 1.0) * (c * (g + c) - 1.0)) / ((c * (g - c) + 1.0) * (c * (g - c) + 1.0)));

		float F = left * right; // Fresnel factor

		if (uIsCookTorrance) {

			float PI = 3.1415926535897932384626433832795;

			// Normal for a facet
			vec3 m = normalize(i + o); // half vector
			
			float cos_theta = abs(dot(m, n)); // angle between m and n
			float tan_theta = (1.0 - cos_theta * cos_theta) / (cos_theta * cos_theta);

			float tan_theta2 = tan_theta * tan_theta; // tan_theta^2
			float sigma2 = uSigma * uSigma; // sigma^2
			float cos_theta4 = cos_theta * cos_theta * cos_theta * cos_theta; // cos_theta^4

			// Geometry term of mask-shadowing
			float G = min(1.0, min(2.0 * (cos_theta * dot(n, o) / dot(o, m)), 2.0 * (cos_theta * dot(n, i) / dot(o, m))));
			// Distribution term of normal distribution
			float D = exp(-(tan_theta2) / (sigma2)) / (PI * (sigma2) * (cos_theta4));

			vec4 fs = (F * D * G) / (4.0 * dot(i, n) * dot(o, n)) * vec4(1.0, 1.0, 1.0, 1.0);
			gl_FragColor = (fs + (vec4(uColor, 1.0) / PI)) * dot(n, i);
		}
		
		else {
			float transmission = 1.0 - F;
			vec4 colorReflection = vec4(textureCube(uSampler, reflectDirection.xzy).xyz * F, 1.0);
			vec4 colorTransmission = vec4(textureCube(uSampler, transmissionDirection.xzy).xyz * transmission, 1.0);
			gl_FragColor = colorTransmission + colorReflection;
		}

	}

	// Perfect mirror
	else if (uIsMirroring)
		gl_FragColor = textureCube(uSampler, reflectDirection.xzy);

	// Transmission
	else if (uIsTransmitting)
		gl_FragColor = textureCube(uSampler, transmissionDirection.xzy);
	
	else {
		vec3 col = vec3(uColor.xyz) * dot(N, normalize(vec3(-pos3D)));
		gl_FragColor = vec4(col, 1.0);
	}
}

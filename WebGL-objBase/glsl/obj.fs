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

uniform vec3 uColor;

// ==============================================
void main(void) {

	//
	vec3 o = normalize(-pos3D.xyz); // view vector
	vec3 i = normalize(-pos3D.xyz); // incident vector
	vec3 n = normalize(N); // normal vector of the surface

	// Mirror + Transmission
	if(uIsMirroring && uIsTransmitting) {

		vec3 reflectDirection = mat3(uRotationMatrix) * reflect(-o, n);
		vec3 transmissionDirection = mat3(uRotationMatrix) * refract(-o, N, 1.0 / uFresnelIndice);

		// formula application (cf. cours diapo 33)
		float c = dot(o, n);
		float g = sqrt((uFresnelIndice * uFresnelIndice) + (c * c) - 1.0);

		// left side of the formula
		float left = 0.5 * (((g - c) * (g - c)) / ((g + c) * (g + c)));
        // right side of the formula
		float right = 1.0 + (((c * (g + c) - 1.0) * (c * (g + c) - 1.0)) / ((c * (g - c) + 1.0) * (c * (g - c) + 1.0)));

		float F = left * right; // fresnel factor

		if(uIsCookTorrance) { // Cook-Torrance

			float PI = 3.1415926535897932384626433832795;

			vec3 m = normalize(i + o); // half vector
			float cos_theta = abs(dot(m, n)); // angle between m and n

			// COOK TORRANCE BECKMANN BRDF MODEL
			float G = min(1.0, min(2.0 * (cos_theta * dot(n, o) / dot(o, m)), 2.0 * (cos_theta * dot(n, i) / dot(o, m))));

			float tan_theta = (1.0 - cos_theta * cos_theta) / (cos_theta * cos_theta);

			float tan_theta2 = tan_theta * tan_theta; // tan_theta^2
			float sigma2 = uSigma * uSigma; // sigma^2
			float cos_theta4 = cos_theta * cos_theta * cos_theta * cos_theta; // cos_theta^4

			float D = exp(-(tan_theta2) / (sigma2)) / (PI * (sigma2) * (cos_theta4));

			vec4 fs = (F * D * G) / (4.0 * dot(i, n) * dot(o, n)) * vec4(1.0, 1.0, 1.0, 1.0);
			gl_FragColor = (fs + (vec4(uColor, 1.0) / PI)) * dot(n, i);
		} else {
			float transmission = 1.0 - F;

			vec4 colorReflection = vec4(textureCube(uSampler, reflectDirection.xzy).xyz * F, 1.0);
			vec4 colorTransmission = vec4(textureCube(uSampler, transmissionDirection.xzy).xyz * transmission, 1.0);

			gl_FragColor = colorTransmission + colorReflection;
		}

	}

	// Mirroir parfait
	else if(uIsMirroring) {
		vec3 reflectDirection = mat3(uRotationMatrix) * reflect(-o, n);
		gl_FragColor = textureCube(uSampler, reflectDirection.xzy);
	}

	// Transmission
	else if(uIsTransmitting) {
		vec3 transmissionDirection = mat3(uRotationMatrix) * refract(-o, n, 1.0 / uFresnelIndice);
		gl_FragColor = textureCube(uSampler, transmissionDirection.xzy);

	} else {
		vec3 col = vec3(uColor.xyz) * dot(N, normalize(vec3(-pos3D)));
		gl_FragColor = vec4(col, 1.0);
	}
}

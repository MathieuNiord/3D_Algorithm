precision highp float;

varying vec4 pos3D;
varying vec3 N;

uniform samplerCube uSampler;
uniform mat4 uRotationMatrix;

// Modes
uniform bool uIsMirroring;
uniform bool uIsTransmitting;
uniform bool uIsCookTorrance;

// Parameters
uniform float uFresnelIndice;
uniform float uSigma;

// Lighting
uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform float uLightIntensity;

uniform vec3 uColor;

#define PI 3.1415926535897932384626433832795

// ==============================================
/* Compute the dot product of two vectors-3
 * bounded by zero */
float ddot(vec3 a, vec3 b) { return max(0.0, dot(a, b)); }

// ==============================================
/* Compute the fresnel factor thanks to the view
 * vector (o) and the normals vector (n) */
float fresnelFactor(vec3 o, vec3 n) {

	// Formula application (cf. lesson - slide 33)
	float c = ddot(o, n);
	float g = sqrt((uFresnelIndice * uFresnelIndice) + (c * c) - 1.0);

	// Left and right side of the formula
	float left = 0.5 * (((g - c) * (g - c)) / ((g + c) * (g + c)));
	float right = 1.0 + (((c * (g + c) - 1.0) * (c * (g + c) - 1.0)) / ((c * (g - c) + 1.0) * (c * (g - c) + 1.0)));

	return left * right;
}

// ==============================================
/* Compute the geometry term of mask-shadowing
 * thanks to the view vector (o), the incident
 * vector (i), the normals vector (n) and the half
 * vector (m) */
float geometryTerm(vec3 o, vec3 i, vec3 n, vec3 m) {
	float cos_theta = ddot(m, n); // Angle between m and n
	return min(
		1.0,
		min(
			2.0 * (cos_theta * ddot(n, o) / ddot(o, m)),
			2.0 * (cos_theta * ddot(n, i) / ddot(i, m))
		)
	); // Geometry term of mask-shadowing
}

// ==============================================
/* Compute the distribution term of normal
 * distribution thanks to the normals vector (n)
 * and the half vector (m) */
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

	// Diffuse color
	vec4 color = vec4(
		vec3(uColor.xyz) * ddot(
			N,
			normalize(vec3(-pos3D))
		),1.0
	);

	// Cook-Torrance
	if (uIsCookTorrance) {

		vec3 m = normalize(i + o); // Half vector (normal of a facet)

		float F = fresnelFactor(o, n); // Fresnel factor
		float G = geometryTerm(o, i, n, m);	// Geometry term of mask-shadowing
		float D = distributionTerm(n, m);	// Distribution term of normal distribution

		vec3 fr = ((1.0 - F) * uColor / PI) + ((F * D * G) / (4.0 * ddot(i, n) * ddot(o, n)));
		vec3 Li = uLightColor * uLightIntensity;

		// Li * fr * cos_theta
		color = vec4(Li * fr * ddot(n, i), 1.0);
	}
	
	// Else if it is both mirroring and transmitting, then applies fresnel factor
	else if (uIsMirroring || uIsTransmitting) {

		vec3 reflectDirection = mat3(uRotationMatrix) * reflect(-o, n);
		vec3 transmissionDirection = mat3(uRotationMatrix) * refract(-o, n, 1.0 / uFresnelIndice);

		// If it is only mirroring or only transmitting
		if (!uIsTransmitting) color = textureCube(uSampler, reflectDirection.xzy); // Perfect mirror
		else if (!uIsMirroring) color = textureCube(uSampler, transmissionDirection.xzy); // Only transmission

		// Else (both case), applies fresnel factor
		else {
			float F = fresnelFactor(o, n); // Fresnel factor
			float transmission = 1.0 - F;
			vec4 colorReflection = vec4(textureCube(uSampler, reflectDirection.xzy).xyz * F, 1.0);
			vec4 colorTransmission = vec4(textureCube(uSampler, transmissionDirection.xzy).xyz * transmission, 1.0);
			color = colorReflection + colorTransmission;
		}
	}
	
	gl_FragColor = color;
}

precision highp float;

varying vec4 pos3D;
varying vec3 N;

uniform samplerCube uSampler;
uniform mat4 uRotationMatrix;

// Modes
uniform bool uIsSampling;
uniform bool uIsFrostedMirror;

// Parameters
uniform float uFresnelIndice;
uniform float uSigma;
uniform int uNbSamples;

// Lighting
uniform float uLightIntensity;

uniform vec3 uColor;

#define PI 3.1415926535897932384626433832795
#define MAX_INTEGER 2147483647
#define SEED_X 12.9898	// Seed for randomizing x position
#define SEED_Y 78.233	// Seed for randomizing y position
#define SEED_FACTOR 43758.5453

// ==============================================
/* Compute the dot product of two vectors-3
 * bounded by zero */
float ddot(vec3 a, vec3 b) {
	return max(0.0, dot(a, b));
}

// ==============================================
/* Compute a random number thanks to the uv
 * coordinates of the fragment
float noise(in vec2 state, float seed) {
	return fract(
		sin(
			seed + dot(
				state, 
				vec2(SEED_X, SEED_Y)
			)
		) * SEED_FACTOR
	);
}*/

// ==============================================
/* Compute a random number thanks to the uv
 * coordinates of the fragment.
 * Forcing highp processing for improvements.
 * see: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/ */
highp float noise(in vec2 co, in float seed)
{
    highp float seed_x = SEED_X;
    highp float seed_y = SEED_Y;
    highp float seed_factor = SEED_FACTOR;

    highp float dt= seed + dot(co.xy ,vec2(seed_x, seed_y)); 
    highp float sn= mod(dt, PI); // Get the sin value within a reasonable range

    return fract(sin(sn) * seed_factor);
}

// ==============================================
/* Compute the rotation of a vector (m) thanks to
 * the normals vector (N) */
vec3 rotate(vec3 m, vec3 N) {

	vec3 i = vec3( 1.0, 0.0, 0.0);

	if (ddot(i, N) > 0.9) {
		i = vec3(0.0, 1.0, 0.0);
	}

	vec3 j = cross(N, i);

	i = cross(j, N);

	return mat3( i, j, N) * m;
}

// ==============================================
/* Compute a random point on the hemisphere
 * thanks to the phi and theta angles and the
 * normals vector (N) */
vec3 getRandomPointOnHemisphere(float seed, vec3 N) {

	// Getting a random noise values for the generation of
	// a random microfacet's position on the hemisphere
	float x_rand = noise(pos3D.xy, seed);
	float y_rand = noise(pos3D.xy, x_rand);
	
	float phi = x_rand * 2.0 * PI;	// Random angle between 0 and 2PI
	float theta = atan(sqrt(-(uSigma * uSigma) * log(1.0 - y_rand))); // Compute the theta angle

	// Compute the random point on the hemisphere
	vec3 m = vec3(
		sin(theta) * cos(phi),
		sin(theta) * sin(phi),
		cos(theta)
	);

	// Rotate the random point on the hemisphere
	return normalize(rotate(m, N));
}

// ==============================================
/* Compute the fresnel factor thanks to the view
 * vector (o) and the normals vector (n) */
float fresnelFactor(vec3 i, vec3 m) {

	// Formula application (cf. lesson - slide 33)
	float c = ddot(i, m);
	float g = sqrt((uFresnelIndice * uFresnelIndice) + (c * c) - 1.0);

	// Left and right side of the formula
	// (1/2) * (g - c)² / (g + c)²
	float left = 0.5 * (((g - c) * (g - c)) / ((g + c) * (g + c)));
	// 1.0 + (c * (g + c) - 1.0)² / (c * (g - c) + 1.0)²
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
 * and the half vector (m).
 * Based on the Beckmann paper. */
float distributionTerm(in float cos_theta) {

	float tan_theta2 = (1.0 - cos_theta * cos_theta) / (cos_theta * cos_theta);

	float sigma2 = uSigma * uSigma; // sigma^2
	float cos_theta4 = cos_theta * cos_theta * cos_theta * cos_theta; // cos_theta^4

	// Distribution term of normal distribution
	return exp(-(tan_theta2) / (2.0 * sigma2)) / (PI * (sigma2) * (cos_theta4));
}

// ==============================================
/* Compute the sampling of the BRDF */
vec3 getSampling(const int nbSamples, vec3 n, vec3 o){
  
	vec3 color = uColor;

	for (int i = 0; i < MAX_INTEGER; i++) {

		if (i >= nbSamples) { break; }

		// Get a random point on the hemisphere
		vec3 m = getRandomPointOnHemisphere(float(i), n);

		float cos_theta = ddot(m, n);
		if (cos_theta <= 0.0) { continue; }

		// Distribution process
		float D = distributionTerm(cos_theta);
		float pdf = D * cos_theta;

		vec3 i_camera = reflect(-o, m);
		float _in = ddot(i_camera, n);
		if (_in <= 0.0) { continue; }

		vec3 i_object = (mat3(uRotationMatrix) * i_camera).xzy;
		vec3 colorFinal = textureCube(uSampler, i_object).xyz;

		// If Fresnel is disabled (only frosted mirror), only process the color
		if (uIsFrostedMirror) {
			color += colorFinal;
		}

		// Else, process BRDF if the object is not a frosted mirror
		else
		{
			float F = fresnelFactor(i_camera, m);
			float G = geometryTerm(o, i_camera, n, m);

			float _on = ddot(o, n);
			if (_on <= 0.0) { continue; }

			vec3 BRDF = vec3((F * D * G) / (4.0 * _in * _on));
			
			color += (colorFinal * BRDF * _in) / pdf;
		}
	}

	return (color / float(nbSamples));
}


// ==============================================
void main(void) {

	vec3 o = normalize(-pos3D.xyz);	// View vector
	vec3 n = normalize(N);			// Normal vector of the surface
	
	// Diffuse color
	vec4 color = vec4(
		vec3(uColor.xyz) * ddot(
			N,
			normalize(vec3(-pos3D))
		),1.0
	);

	// Sampling process
	if (uIsSampling || uIsFrostedMirror) {
		int nbSamples = uNbSamples; // Parsing the number of samples
    	vec3 sampling = getSampling(nbSamples, n, o);
    	color = vec4(sampling * uLightIntensity, 1.0);
	}
	
	gl_FragColor = color * uLightIntensity;
}
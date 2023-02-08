precision highp float;

varying vec4 pos3D;
varying vec3 N;

uniform samplerCube uSampler;
uniform mat4 uRotationMatrix;

// Modes
uniform bool uIsSampling;

// Parameters
uniform float uFresnelIndice;
uniform float uSigma;
uniform int uNbSamples;

// Lighting
uniform float uLightIntensity;

uniform vec3 uColor;

#define PI 3.1415926535897932384626433832795
#define MAX_INTEGER 2147483647

// ==============================================
/* Compute the dot product of two vectors-3
 * bounded by zero */
float ddot(vec3 a, vec3 b) { return max(0.0, dot(a, b)); }

// ==============================================
/* Compute a random number thanks to the uv
 * coordinates of the fragment */
float getRandom(in vec2 uv){
	return fract(
		sin(
			dot(
				uv, 
				vec2(12.9898,78.233)
			)
		) * 43758.5453
	);
}

// ==============================================
/* Compute the fresnel factor thanks to the view
 * vector (o) and the normals vector (n) */
float fresnelFactor(vec3 i, vec3 m) {

	// Formula application (cf. lesson - slide 33)
	float c = ddot(i, m);
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
/* Compute the rotation of a vector (m) thanks to
 * the normals vector (N) */
vec3 rotate(vec3 m, vec3 N) {
  vec3 i = vec3( 1.0, 0.0, 0.0);
  if (ddot(i, N) > 0.9) { i = vec3(0.0, 1.0, 0.0); }
  vec3 j = cross(N, i);
  i = cross(j, N);
  return mat3( i, j, N) * m;
}


/* vec3 frostedMirror(const int nbSamples, vec3 n, vec3 o) {

	for(int i = 0; i < MAX_INTEGER; i++) {

		if (i >= nbr) break;

		float rand1 = getRandom(pos3D.xy + float(i));
    	float rand2 = getRandom(pos3D.xy + rand1);

		float Phim = 2.0 * PI * rand1;

		float Thetam = atan(sqrt(-pow(uSigma * uSigma) * log(1.0 - rand2)));
		vec3 M = vec3(sin(Thetam) * cos(Phim), sin(Thetam) * sin(Phim), cos(Thetam));

		mat3 MatRot = createLocalMatrix(N, Vo);
		vec3 Mfinal = MatRot * M;

		vec3 directionReflect = mat3(uIRMatrix) * reflect(-M, Normal);
		col += vec4(textureCube(u_skybox, directionReflect.xzy).xyz, 1.0);
	}

	color /= float(nbr);

	return vec3(0.0, 0.0, 0.0);
} */

// ==============================================
/* Compute the sampling of the BRDF */
vec3 getSampling(const int nbSamples, vec3 n, vec3 o){
  
  vec3 color = uColor;

  for (int i = 0; i < MAX_INTEGER; i++) {

	if (i >= nbSamples) { break; }

    float rand1 = getRandom(pos3D.xy + float(i));
    float rand2 = getRandom(pos3D.xy + rand1);

    float phi = rand1 * 2.0 * PI;
    float theta = atan(sqrt(-(uSigma * uSigma) * log(1.0 - rand2)));

    float x = sin(theta) * cos(phi);
    float y = sin(theta) * sin(phi);
    float z = cos(theta);
    
    vec3 m = vec3(x, y, z);
    m = rotate(m, n);
    m = normalize(m);

    float D = distributionTerm(n, m);
    float cosThetaM = ddot(m, n);
	if (cosThetaM <= 0.0) { continue; }

    float pdf = D * cosThetaM;

    vec3 Icam = reflect(-o,m);
    float IN = ddot(Icam,n);
	if (IN <= 0.0) { continue; }

    vec3 Iobj = (mat3(uRotationMatrix) * Icam).xzy;
    vec3 colorFinal = textureCube(uSampler, Iobj).xyz;

    float F = fresnelFactor(Icam, m);
    float G = geometryTerm(o, Icam, n, m);
    float ON = ddot(o, n);
	if (ON <= 0.0) { continue; }

    vec3 BRDF = vec3((F * D * G) / (4.0 * IN * ON));

    color += colorFinal * BRDF * IN / pdf;
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

	if (uIsSampling){
		int nbSamples = uNbSamples;
    	vec3 sampling = getSampling(nbSamples, n, o);
    	color = vec4(sampling * uLightIntensity, 1.0);
	}

	//if(uIsMiroirDepoli) {}
	
	gl_FragColor = color;
}
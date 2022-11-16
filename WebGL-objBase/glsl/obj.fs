precision mediump float;

varying vec4 pos3D;
varying vec3 N;

uniform samplerCube uSampler;
uniform mat4 uRotationMatrix;
uniform bool uIsMirroring;
uniform bool uIsTransmitting;
uniform float uFresnelIndice;

uniform vec3 uColor;

// ==============================================
void main(void)
{

	normalize(N);
	vec3 I = normalize(-pos3D.xyz);
	
	// Mirror + Transmission
	if (uIsMirroring && uIsTransmitting) { 

		vec3 reflectDirection = mat3(uRotationMatrix) * reflect(-I,N);
		vec3 transmissionDirection = mat3(uRotationMatrix) * refract(-I, N, 1.0 / uFresnelIndice);

		//formula application (cf. cours diapo 33)
		float c = dot(I, N);
        float g = sqrt((uFresnelIndice * uFresnelIndice) + (c * c) - 1.0);

		//left side of the formula
        float left = 0.5 * (((g - c) * (g - c)) / ((g + c) * (g + c)));

        //right side of the formula
		float right = 1.0 + (((c * (g + c) - 1.0) * (c * (g + c) - 1.0)) / ((c * (g - c) + 1.0) * (c * (g - c) + 1.0)));
		
		float reflection = left * right; // fresnel factor
		float transmission = 1.0 - reflection;
		
		vec4 colorReflection = vec4(textureCube(uSampler, reflectDirection.xzy).xyz * reflection, 1.0);
		vec4 colorTransmission = vec4(textureCube(uSampler, transmissionDirection.xzy).xyz * transmission, 1.0);

		gl_FragColor = colorTransmission + colorReflection;	
	}

	// Mirroir parfait
	else if (uIsMirroring) { 
		vec3 reflectDirection = mat3(uRotationMatrix) * reflect(-I,N);
        gl_FragColor = textureCube(uSampler, reflectDirection.xzy);
	}

	// Transmission
	else if (uIsTransmitting) { 
		vec3 transmissionDirection = mat3(uRotationMatrix) * refract(-I, N, 1.0 / uFresnelIndice);
		gl_FragColor = textureCube(uSampler, transmissionDirection.xzy);
		
	}
	else {
		vec3 col = vec3(uColor.xyz) * dot(N,normalize(vec3(-pos3D)));
		gl_FragColor = vec4(col,1.0);
	}
}

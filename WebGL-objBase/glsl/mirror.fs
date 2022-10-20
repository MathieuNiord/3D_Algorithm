precision mediump float;
    
varying vec4 vPosition;
varying vec3 vNormal;
    
uniform samplerCube uSampler;
uniform mat4 uInversedRotationMatrix;
    
void main() {

    vec3 normals = normalize(vNormal);
    vec3 I = normalize(-vPosition.xyz);
    vec3 R = reflect(I,normals);
    vec3 direction = mat3(uInversedRotationMatrix) * R;
    
    gl_FragColor = textureCube(uSampler, -direction.xzy);
}
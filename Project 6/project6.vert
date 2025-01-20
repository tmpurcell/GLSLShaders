#version 330 compatibility

uniform float uExplosion; // Controls the intensity of the explosion

out vec2 vST;   // texture coords
out vec3 vN;    // normal vector
out vec3 vL;    // vector from point to light
out vec3 vE;    // vector from point to eye
out vec3 vMCposition;

const vec3 LIGHTPOSITION = vec3(5., 5., 0.);

void main()
{
    vST = gl_MultiTexCoord0.st;
    vMCposition = gl_Vertex.xyz;
    vec4 ECposition = gl_ModelViewMatrix * gl_Vertex;
    vN = normalize(gl_NormalMatrix * gl_Normal);
    vL = LIGHTPOSITION - ECposition.xyz;
    vE = vec3(0., 0., 0.) - ECposition.xyz;
    
    // Explosion effect
    vec3 displacedPosition = gl_Vertex.xyz + (normalize(gl_Normal) * uExplosion);
    gl_Position = gl_ModelViewProjectionMatrix * vec4(displacedPosition, 1.0);
    vMCposition = displacedPosition;
}
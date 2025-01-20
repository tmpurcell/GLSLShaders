#version 330 compatibility

uniform float uA, uB, uC, uD;

out vec2 vST;   // texture coords
out vec3 vN;    // normal vector
out vec3 vL;    // vector from point to light
out vec3 vE;    // vector from point to eye
out vec3 vMCposition;

const vec3 LIGHTPOSITION = vec3(5., 5., 0.);

void main()
{
    vec3 vert = gl_Vertex.xyz;

    float r = sqrt((vert.x * vert.x) + (vert.y * vert.y));
    vert.z = uA * cos(2 * 3.14159 * uB *r + uC) * exp(-uD*r);

    float dzdr = uA * (-sin(2.* 3.14159 * uB * r + uC) * 2.* 3.14159 * uB * exp(-uD*r) + cos(2. * 3.14159 * uB * r + uC) * -uD * exp(-uD * r));

    float drdx = vert.x/r;
    float drdy = vert.y/r;

    float dzdx = dzdr * drdx;
    float dzdy = dzdr * drdy;

    vec3 Tx = vec3(1., 0., dzdx );
    vec3 Ty = vec3(0., 1., dzdy );

    vec3 normal = normalize( cross( Tx, Ty ) );

    vST = gl_MultiTexCoord0.st;
    vMCposition = gl_Vertex.xyz;
    vec4 ECposition = gl_ModelViewMatrix * vec4(vert, 1.);
    vN = normalize(gl_NormalMatrix * normal);
    vL = LIGHTPOSITION - ECposition.xyz;
    vE = vec3(0., 0., 0.) - ECposition.xyz;
    vMCposition = gl_Vertex.xyz;

    gl_Position = gl_ModelViewProjectionMatrix * vec4(vert, 1.);
}
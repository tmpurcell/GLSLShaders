#version 330 compatibility

uniform float uKa, uKd, uKs;    // coefficients of each type of lighting
uniform float uShininess;       // specular exponent
uniform float uAd, uBd;
uniform float uTol;

in vec2 vST;       // texture coords
in vec3 vN;        // normal vector
in vec3 vL;        // vector from point to light
in vec3 vE;        // vector from point to eye
in vec3 vMCposition;
vec3 RED = vec3(1., 0., 0.);
vec3 BLUE = vec3(0., 0., 1.);

void main()
{
    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);

    vec3 myColor = vec3(0.0, 1.0, 1.0);  // Initial color for the ellipse
    vec3 mySpecularColor = vec3(1., 1., 1.);

    float Ar = uAd/2;
    float Br = uBd/2;
    int numins = int(vST.s/uAd);
    int numint = int(vST.t/uBd);
    float sc = numins*uAd + Ar;
    float tc = numint*uBd + Br;

   float equation = ((vST.s - sc) / Ar) * ((vST.s - sc) / Ar) + ((vST.t - tc) / Br) * ((vST.t - tc) / Br);
   float t = smoothstep(1. -uTol, 1+uTol, equation);
   myColor = mix(RED, BLUE, t);
    
    // here is the per-fragment lighting:
	vec3 ambient = uKa * myColor;
	float d = 0.;
	float s = 0.;
	if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
	{
		d = dot(Normal,Light);
		vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection vector
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 diffuse =  uKd * d * myColor;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}
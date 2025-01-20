#version 330 compatibility

uniform float uKa, uKd, uKs;    // coefficients of each type of lighting
uniform float uShininess;       // specular exponent

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

    vec3 myColor = vec3(0.18,0.671,0.475);
    vec3 mySpecularColor = vec3(1., 1., 1.);

    
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
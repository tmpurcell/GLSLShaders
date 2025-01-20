#version 330 compatibility

uniform float uKa, uKd, uKs;    // coefficients of each type of lighting
uniform float uShininess;       // specular exponent
uniform float uNoiseFreq, uNoiseAmp;
uniform sampler3D Noise3;

in vec2 vST;       // texture coords
in vec3 vN;        // normal vector
in vec3 vL;        // vector from point to light
in vec3 vE;        // vector from point to eye
in vec3 vMCposition;

vec3 BLACK = vec3(0., 0., 0.);
vec3 CYAN = vec3(0.,0.804,0.804);

vec3
RotateNormal( float angx, float angy, vec3 n )
{
	float cx = cos( angx );
	float sx = sin( angx );
	float cy = cos( angy );
	float sy = sin( angy );
	
	// rotate about x:
	float yp =  n.y*cx - n.z*sx;	// y'
	n.z      =  n.y*sx + n.z*cx;	// z'
	n.y      =  yp;
	// n.x      =  n.x;

	// rotate about y:
	float xp =  n.x*cy + n.z*sy;	// x'
	n.z      = -n.x*sy + n.z*cy;	// z'
	n.x      =  xp;
	// n.y      =  n.y;

	return normalize( n );
}

void main()
{
	
	vec4 nvx = texture( Noise3, uNoiseFreq*vMCposition );
	float angx = nvx.r + nvx.g + nvx.b + nvx.a  -  2.;	// -1. to +1.
	angx *= uNoiseAmp;
	

    vec4 nvy = texture( Noise3, uNoiseFreq*vec3(vMCposition.xy,vMCposition.z+0.5) );
	float angy = nvy.r + nvy.g + nvy.b + nvy.a  -  2.;	// -1. to +1.
	angy *= uNoiseAmp;

	vec3 n = RotateNormal( angx, angy, vN);
	n = normalize(n);

    
    // here is the per-fragment lighting:
	vec3 Normal = n;
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);

	vec3 myColor = vec3(0.0, 1.0, 1.0);
    vec3 mySpecularColor = vec3(1., 1., 1.);

	vec3 ambient = uKa * myColor;
	float dd = 0.;
	float s = 0.;
	if( dot(Normal,Light) > 0. ) // only do specular if the light can see the point
	{
		dd = dot(Normal,Light);
		vec3 ref = normalize( reflect( -Light, Normal ) ); // reflection vector
		s = pow( max( dot(Eye,ref),0. ), uShininess );
	}
	vec3 diffuse =  uKd * dd * myColor;
	vec3 specular = uKs * s * mySpecularColor;
	gl_FragColor = vec4( ambient + diffuse + specular, 1. );
}
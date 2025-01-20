#version 330 compatibility

uniform float uKa, uKd, uKs;    // Coefficients of each type of lighting
uniform float uShininess;       // Specular exponent
uniform float uPatternWidth, uDotWidth, uDotHeight;  // Uniforms for pattern control
uniform float Timer;

in vec2 vST;       // Texture coords
in vec3 vN;        // Normal vector
in vec3 vL;        // Vector from point to light
in vec3 vE;        // Vector from point to eye
in vec3 vMCposition;

void main()
{
    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);

    vec3 roadColor = vec3(0.204, 0.212, 0.204);  // Gray color for the road
    vec3 lineColor = vec3(1.0, 1.0, 1.0);  // White color for the lines
    vec3 myColor;
    vec3 mySpecularColor = vec3(1.0, 1.0, 1.0);  // White color for specular highlights

    // Determine if we're within the y-axis bounds of the central row
    float centerY = 0.0;
    float centralBandHeight = 0.2;
    bool inCentralBand = abs(vMCposition.y - centerY) < (centralBandHeight / 2.0);

    // Logic for painting dotted lines, considering both X and Y dimensions
    bool inDotRegionX = mod(vMCposition.x + sin(Timer), uPatternWidth) < uDotWidth;
    bool inDotRegionY = mod(vMCposition.y, uPatternWidth) < uDotHeight;

    if (inDotRegionX && inDotRegionY && inCentralBand) {
        myColor = lineColor;  // Use line color for the dot
    } else {
        myColor = roadColor;  // Use road color otherwise
    }

    // Per-fragment lighting calculations
    vec3 ambient = uKa * myColor;
    float d = 0.;
    float s = 0.;
    if (dot(Normal, Light) > 0.) {
        d = dot(Normal, Light);
        vec3 ref = normalize(reflect(-Light, Normal));  // Reflection vector
        s = pow(max(dot(Eye, ref), 0.), uShininess);
    }
    vec3 diffuse = uKd * d * myColor;
    vec3 specular = uKs * s * mySpecularColor;
    gl_FragColor = vec4(ambient + diffuse + specular, 1.);
}
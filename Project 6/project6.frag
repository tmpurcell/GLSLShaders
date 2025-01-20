#version 330 compatibility

uniform float uKa, uKd, uKs;    // Lighting coefficients
uniform float uShininess;       // Specular exponent
uniform float uLineSpacing;     // Spacing between lines
uniform float uLineWidth;       // Width of the lines
uniform float uGlowWidth;       // Width of the glow effect

in vec2 vST;       // Texture coordinates
in vec3 vN;        // Normal vector
in vec3 vL;        // Vector from point to light
in vec3 vE;        // Vector from point to eye

void main()
{
    vec3 Normal = normalize(vN);
    vec3 Light = normalize(vL);
    vec3 Eye = normalize(vE);
    vec3 baseColor = vec3(0.5, 0.5, 0.5); // Gray base color
    vec3 lineColor = vec3(1.0, 0.302, 0.0); // Orange line color

    // Calculate distance to the nearest line (horizontal or vertical)
    float lineDistS = abs(mod(vST.s * uLineSpacing, 1.0) - 0.5);
    float lineDistT = abs(mod(vST.t * uLineSpacing, 1.0) - 0.5);
    float lineDist = min(lineDistS, lineDistT);

    // Determine if the fragment is within the glow effect range
    bool inGlowRange = lineDist < (uLineWidth + uGlowWidth);

    // Calculate glow intensity (fades with distance)
    float glowIntensity = inGlowRange ? (1.0 - smoothstep(uLineWidth, uLineWidth + uGlowWidth, lineDist)) : 0.0;

    // Base color mixed with glow effect
    vec3 colorWithGlow = mix(baseColor, lineColor, glowIntensity);

    // Determine if the fragment is within the line itself
    bool inLine = lineDist < uLineWidth;

    // Apply line color directly if within the line width
    if(inLine) {
        colorWithGlow = lineColor;
    }

    // Lighting calculations
    vec3 ambient = uKa * colorWithGlow;
    float diffuseCoefficient = max(dot(Normal, Light), 0.0);
    vec3 diffuse = uKd * diffuseCoefficient * colorWithGlow;
    vec3 specular = vec3(0.0);
    if(diffuseCoefficient > 0.0) {
        vec3 reflection = normalize(reflect(-Light, Normal));
        float specularCoefficient = pow(max(dot(Eye, reflection), 0.0), uShininess);
        specular = uKs * specularCoefficient * vec3(1.0, 1.0, 1.0); // White specular highlights
    }

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
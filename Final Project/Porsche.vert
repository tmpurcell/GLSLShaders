#version 330 compatibility

uniform float Timer; // Elapsed time
uniform float uExplosionMagnitude; // Magnitude of explosion
uniform float uRandomX; // Random X coordinate
uniform float uRandomY; // Random Y coordinate
uniform float uRandomZ; // Random Z coordinate
float explodeTime = 0.8; // Time at which explosion starts
float maxTime = 1.0; // Time at which explosion is complete
float explosionRadius = 1.0; // Radius of the explosion area

out vec2 vST;   // texture coords
out vec3 vN;    // normal vector
out vec3 vL;    // vector from point to light
out vec3 vE;    // vector from point to eye
out vec3 vMCposition;
out vec4 carColor; // Output car color

const vec3 LIGHTPOSITION = vec3(5.0, 5.0, 0.0);
const vec3 EXPLOSION_CENTER = vec3(0.0, 0.0, 0.0); // Center of explosion

void main() {
    vec4 modifiedPosition = gl_Vertex;

    // Basic movement
    modifiedPosition.x -= Timer * 4.0;

    // Explosion effect
    if (Timer > explodeTime) {
        float explodeFactor = (Timer - explodeTime) / (maxTime - explodeTime);
        explodeFactor = clamp(explodeFactor, 0.0, 1.0); // Ensure factor is between 0 and 1
        
        // Calculate distance from explosion center
        float distanceFromExplosion = length(modifiedPosition.xyz - EXPLOSION_CENTER);
        
        // Check if the vertex is within the explosion radius
        if (distanceFromExplosion < explosionRadius) {
            // Calculate random displacement
            vec3 randomOffset = vec3(
                fract(sin(gl_Vertex.x * uRandomX) * 43758.5453),
                fract(sin(gl_Vertex.y * uRandomY) * 23421.631),
                fract(sin(gl_Vertex.z * uRandomZ) * 39487.123)
            );
            randomOffset = 2.0 * randomOffset - vec3(1.0); // Map range [0, 1] to [-1, 1]
            
            vec3 direction = normalize(EXPLOSION_CENTER - modifiedPosition.xyz); // Adjust direction calculation
            
            // Calculate remaining time
            float remainingTime = maxTime - Timer;
            if (remainingTime < 0.0) {
                remainingTime = 0.0; // Ensure remainingTime is non-negative
            }

            // Move away from the explosion center
            modifiedPosition.xyz += direction * explodeFactor * uExplosionMagnitude * remainingTime * randomOffset;
        }
    }

    vST = gl_MultiTexCoord0.st;
    vMCposition = modifiedPosition.xyz;
    vec4 ECposition = gl_ModelViewMatrix * modifiedPosition;
    vN = normalize(gl_NormalMatrix * gl_Normal);
    vL = LIGHTPOSITION - ECposition.xyz;
    vE = -ECposition.xyz;
    
    gl_Position = gl_ModelViewProjectionMatrix * modifiedPosition;
}
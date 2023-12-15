varying vec3 v_worldNormal;
varying vec3 v_eyeVector;

void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vec4 mvPosition = viewMatrix * worldPos;

    gl_Position = projectionMatrix * mvPosition;

    vec3 transformedNormal = normalMatrix * normal;
    v_worldNormal = normalize(transformedNormal);

    v_eyeVector = normalize(mvPosition.xyz - cameraPosition);
}
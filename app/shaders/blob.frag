uniform float u_intensity;
uniform float u_time;

varying vec2 v_Uv;
varying float v_Displacement;

void main() {
    float distort = 2.0 * u_intensity * v_Displacement;
    vec3 color = vec3(abs(v_Uv - 0.5) * 2.0 * (1.0 - distort), 1.0);
    gl_FragColor = vec4(color, 1.0);
}
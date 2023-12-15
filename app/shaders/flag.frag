uniform vec3 u_colorA;
uniform vec3 u_colorB;

varying float v_Z;

void main() {
  vec3 color = mix(u_colorA, u_colorB, v_Z * 2.0 + 0.5);
  gl_FragColor = vec4(color, 1.0);
}